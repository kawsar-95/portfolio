# Portfolio — CI/CD & Server Setup

This folder contains the runtime pieces the Azure VM needs (`docker-compose.yml`,
`Caddyfile`, `.env.example`). The GitHub Actions workflow at
`.github/workflows/deploy.yml` syncs `docker-compose.yml` and `Caddyfile` to the
server on every push to `main`; the server never sees any application source
code — only the built container image pulled from GHCR.

Follow the sections below **in order** the first time. Later deploys are just
`git push origin main`.

---

## 0. What we're building

```
 push to main ──► GitHub Actions runner
                    │
                    ├─ docker build (multi-stage, next standalone)
                    ├─ docker push  ghcr.io/chishty313/devops-themed-personal-portfolio:sha-<git-sha>
                    │                                             + :latest
                    │
                    └─ ssh deploy@<azure-vm>
                         ├─ rsync ./deploy/  →  /opt/portfolio/
                         ├─ pin IMAGE=sha-<git-sha> in /opt/portfolio/.env
                         └─ docker compose pull && up -d
                                          │
                                          ├─ web   (your Next.js image, port 3000, private net)
                                          └─ caddy (ports 80/443, TLS via Let's Encrypt,
                                                    reverse-proxies chishty.me → web:3000)
```

Zero source on the server. Only the image, the compose file, the Caddyfile,
and the `.env` file live on disk.

---

## 1. DNS — Namecheap

You need an **A record** pointing `chishty.me` (and `www`) at your Azure VM's
public IPv4 address.

1. Log in to Namecheap → Domain List → **Manage** next to `chishty.me`.
2. Open the **Advanced DNS** tab.
3. Remove any existing `@` / `www` `URL Redirect` or `CNAME` records that
   collide with the ones below (leave MX / TXT records alone).
4. Add these two records:

   | Type       | Host  | Value                     | TTL       |
   | ---------- | ----- | ------------------------- | --------- |
   | `A Record` | `@`   | `<AZURE_VM_PUBLIC_IPv4>`  | Automatic |
   | `A Record` | `www` | `<AZURE_VM_PUBLIC_IPv4>`  | Automatic |

5. Save. Verify from your Mac after ~5 minutes:

   ```sh
   dig +short chishty.me
   dig +short www.chishty.me
   ```

   Both should return the Azure IP. **Don't move on until DNS resolves.**
   Caddy will fail to obtain a TLS cert if DNS isn't pointing here yet.

---

## 2. Azure — open the firewall

In the Azure Portal for your VM → **Networking → Network settings → Inbound
port rules**, make sure these ports are allowed from `Any` source:

| Port | Protocol | Purpose                              |
| ---- | -------- | ------------------------------------ |
| 22   | TCP      | SSH (restrict later; see §9)         |
| 80   | TCP      | HTTP (Let's Encrypt HTTP-01 + redirect) |
| 443  | TCP      | HTTPS                                |
| 443  | UDP      | HTTP/3 (QUIC) — optional but nice    |

If the VM also has a host firewall (`ufw`), you'll open the same ports in §3.

---

## 3. Server bootstrap (run once on the Azure VM)

SSH in as whatever admin user Azure gave you (`azureuser` on the default
Ubuntu image). Everything below assumes Ubuntu 22.04 or 24.04 LTS.

### 3.0. Check the VM's CPU architecture (30 seconds — do this first)

```sh
uname -m
```

- `x86_64` → default; the pipeline works as shipped.
- `aarch64` → the VM is ARM64 (common on Azure's cheap Dpsv5 / Epsv5 /
  Dpls series). You **must** tell the workflow to build an ARM image, or
  every deploy will die with `exec format error`. Open
  `.github/workflows/deploy.yml`, find the `Build & push` step, and add a
  `platforms: linux/arm64` line under `with:`.

### 3a. Update & install Docker Engine + Compose plugin

```sh
sudo apt-get update
sudo apt-get -y upgrade
sudo apt-get -y install ca-certificates curl gnupg ufw rsync

# Docker's official apt repo
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get -y install docker-ce docker-ce-cli containerd.io \
                        docker-buildx-plugin docker-compose-plugin

sudo systemctl enable --now docker
```

### 3b. Host firewall (`ufw`)

```sh
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 443/udp
sudo ufw --force enable
sudo ufw status
```

### 3c. Create the non-root `deploy` user

We never let GitHub Actions log in as `root` or `azureuser`. It gets its own
locked-down user that can only manage the docker stack.

```sh
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG docker deploy
sudo mkdir -p /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo touch /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo chown -R deploy:deploy /home/deploy/.ssh
```

### 3d. Create the app directory owned by `deploy`

```sh
sudo mkdir -p /opt/portfolio
sudo chown deploy:deploy /opt/portfolio
```

---

## 4. Generate the SSH deploy key (on your Mac, not the server)

This key pair is *dedicated* to GitHub Actions — never reuse your personal key.

```sh
ssh-keygen -t ed25519 -C "github-actions@portfolio" \
  -f ~/.ssh/portfolio_deploy -N ""
```

You now have:

- `~/.ssh/portfolio_deploy`      → **private** key (goes into a GitHub Secret)
- `~/.ssh/portfolio_deploy.pub`  → **public**  key (goes onto the server)

Install the **public** half on the server. From your Mac, in one shot:

```sh
cat ~/.ssh/portfolio_deploy.pub | ssh azureuser@<AZURE_VM_IP> \
  "sudo tee -a /home/deploy/.ssh/authorized_keys >/dev/null && \
   sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys && \
   sudo chmod 600 /home/deploy/.ssh/authorized_keys"
```

If `sudo` prompts for a password over the pipe and hangs, fall back to
manual: `cat ~/.ssh/portfolio_deploy.pub` on your Mac, copy the single
line, then SSH in as `azureuser` and paste it into
`/home/deploy/.ssh/authorized_keys` with `sudo nano`.

Verify from your Mac:

```sh
ssh -i ~/.ssh/portfolio_deploy deploy@<AZURE_VM_IP> "docker ps"
```

You should get a login and an empty docker table. **Don't move on until
this works** — GitHub Actions will fail the exact same way if it can't SSH.

---

## 5. GHCR pull credentials (on the server, as `deploy`)

Because the repo is **private**, its container image is private too. The server
needs a token to `docker pull` from GHCR.

### 5a. Create a fine-scoped PAT on GitHub

1. https://github.com/settings/tokens → **Generate new token (classic)**.
2. Name it `portfolio-server-ghcr-read`.
3. Expiration: 1 year (put a reminder in your calendar).
4. Scope: **only** `read:packages`.
5. Copy the token — you'll see it once.

### 5b. Log the server into GHCR (one time, as `deploy`)

```sh
# on the Azure VM
sudo -iu deploy
echo '<PASTE_THE_PAT_HERE>' | docker login ghcr.io -u chishty313 --password-stdin
```

Docker writes `~/.docker/config.json` with a base64 credential; every future
`docker compose pull` uses it. If the token expires, `docker pull` will 401 —
re-run this step with a new PAT.

---

## 6. GitHub — configure Secrets & Variables

Go to your repo → **Settings → Secrets and variables → Actions**.

### 6a. Create an environment named `production`

**Settings → Environments → New environment → `production`.** The deploy job is
gated to this environment; you can add required reviewers later if you want a
manual approval step. Put the SSH secrets on the environment (not the repo)
so they never leak into PR builds:

| Type   | Name              | Value                                                       |
| ------ | ----------------- | ----------------------------------------------------------- |
| Secret | `SSH_HOST`        | Your Azure VM's public IPv4 (or `chishty.me` once DNS works) |
| Secret | `SSH_USER`        | `deploy`                                                    |
| Secret | `SSH_PRIVATE_KEY` | The **contents** of `~/.ssh/portfolio_deploy` (include the `-----BEGIN/END-----` lines and the trailing newline) |

### 6b. Repository variables (non-secret, optional overrides)

**Settings → Secrets and variables → Actions → Variables tab.** All three are
optional — the workflow ships with sensible defaults.

| Name       | Default        | When to override                                     |
| ---------- | -------------- | ---------------------------------------------------- |
| `SSH_PORT` | `22`           | If you move SSH off port 22 later                    |
| `APP_DIR`  | `/opt/portfolio` | If you deploy to a different path                  |

> The image name is derived from `${{ github.repository }}` automatically, and
> `GITHUB_TOKEN` (auto-provisioned per run) handles the push to GHCR. You do
> **not** need a PAT for pushing — only for the server's pull side in §5.

---

## 7. First deploy

1. Commit and push everything on this branch to `main`.
2. Watch the run at **Actions → Build & Deploy** in GitHub. On the first run
   the Docker build has no layer cache — expect ~4–6 minutes. Later builds
   are ~1–2 minutes thanks to `type=gha` cache.
3. The `deploy` job SSHes in, rsyncs `deploy/` to `/opt/portfolio/`, writes
   `IMAGE=ghcr.io/chishty313/devops-themed-personal-portfolio:sha-<sha>` into `.env`, then runs
   `docker compose pull && docker compose up -d`.
4. Caddy will fetch a Let's Encrypt cert automatically for `chishty.me` and
   `www.chishty.me` (takes 5–30 seconds). Follow along:

   ```sh
   ssh -i ~/.ssh/portfolio_deploy deploy@<AZURE_VM_IP>
   cd /opt/portfolio
   docker compose ps
   docker compose logs -f caddy   # look for "certificate obtained successfully"
   docker compose logs -f web
   ```

5. Visit **https://chishty.me** — you should see your portfolio, served over
   HTTPS with a valid cert. HTTP → HTTPS redirect is automatic.

---

## 8. Day-to-day operations

### Add a runtime env var (e.g. Resend API key)

1. On the server, edit `/opt/portfolio/.env` and add the line
   (`RESEND_API_KEY=re_...`).
2. Restart: `docker compose up -d` (compose reads `.env` and recreates `web`).
3. Nothing needs to change in GitHub — the `env_file: .env` in the compose
   file feeds it into the container.

For values you want in **all** environments (not secrets), you can instead add
them under `environment:` in `deploy/docker-compose.yml` and let the pipeline
sync them.

### Roll back to a previous image

Every commit is tagged `sha-<full-sha>`, so:

```sh
ssh -i ~/.ssh/portfolio_deploy deploy@<AZURE_VM_IP>
cd /opt/portfolio
sed -i 's|^IMAGE=.*|IMAGE=ghcr.io/chishty313/devops-themed-personal-portfolio:sha-<previous-sha>|' .env
docker compose pull
docker compose up -d
```

### Tail logs

```sh
docker compose logs -f web        # your Next.js server
docker compose logs -f caddy      # TLS / HTTP access log
```

### Manually trigger a deploy (no code change)

GitHub → **Actions → Build & Deploy → Run workflow → main**. The workflow has
`workflow_dispatch:` enabled.

---

## 9. Hardening (do this once things work)

- **SSH:** in `/etc/ssh/sshd_config` set `PasswordAuthentication no` and
  `PermitRootLogin no`, then `sudo systemctl restart ssh`. Confirm you can
  still SSH in a *new* terminal before closing the current one.
- **Restrict SSH source IPs** in Azure NSG to your home/office IP if you can.
- **Move SSH off port 22** (edit `sshd_config`, update `ufw`, update the
  `SSH_PORT` GitHub variable, update the Azure NSG rule).
- **Unattended upgrades:** `sudo apt-get install unattended-upgrades && sudo dpkg-reconfigure --priority=low unattended-upgrades`.
- **PAT rotation:** put a calendar reminder for the GHCR PAT's expiry.

---

## 10. Troubleshooting cheatsheet

| Symptom | Where to look |
| ------- | ------------- |
| Actions build fails at `npm ci` | Node/version mismatch — the Dockerfile pins Node 22-alpine; check `engines` in `package.json` if you added one |
| Actions `deploy` step: `Permission denied (publickey)` | SSH key not installed on server for `deploy` user, or `SSH_PRIVATE_KEY` secret missing the `-----BEGIN/END-----` lines |
| Server: `docker compose pull` → `denied: denied` | GHCR PAT missing or expired — redo §5b |
| Site loads on HTTP but HTTPS shows cert error | DNS not yet propagated to Azure IP, or port 80 blocked (Let's Encrypt needs port 80 for HTTP-01). `docker compose logs caddy` will say which |
| `502 Bad Gateway` from Caddy | `web` container crashed — `docker compose logs web`. Common cause: missing runtime env var |
| Every deploy pulls but doesn't refresh | Check `.env` on server actually has the new `IMAGE=` line; check `docker compose ps` shows the new image digest |
