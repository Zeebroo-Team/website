# Auto-deploy pipeline (GitHub Actions → Ubuntu)

Deploys this repo to `/var/www/melt/melting-app` and restarts `melting-app.service` on every push to `main`.

## Architecture

```text
GitHub (main) → GitHub Actions → SSH → git pull on server → systemctl restart melting-app
                                                      ↓
                                              Nginx → Melt :8788
```

## 1. Server prerequisites

On the Ubuntu server (once):

```bash
# Melt runtime (adjust if you install elsewhere)
# Build melting-lang and install melt, e.g.:
#   sudo cp /path/to/melting-lang/build/melt /usr/local/bin/melt

# App directory
sudo mkdir -p /var/www/melt
sudo chown -R $USER:www-data /var/www/melt

# Clone repo (first time only)
git clone git@github.com:Zeebroo-Team/website.git /var/www/melt/melting-app
cd /var/www/melt/melting-app
chmod +x scripts/deploy.sh

# systemd + nginx (see deploy/*.example)
sudo cp deploy/melting-app.service.example /etc/systemd/system/melting-app.service
# Edit ExecStart if melt is not at /usr/local/bin/melt
sudo systemctl daemon-reload
sudo systemctl enable --now melting-app
```

Ensure `public/images/` (logo, poster, `demo.mp4`) exists on the server — they must be committed in git or copied manually.

## 2. Deploy user and SSH key

Create a dedicated Linux user for CI (recommended) or use your existing deploy user:

```bash
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG www-data deploy
```

On your **local machine**, generate a key used only for GitHub Actions:

```bash
ssh-keygen -t ed25519 -C "github-actions-zeebroo" -f ~/.ssh/zeebroo_deploy -N ""
```

Add the **public** key to the server:

```bash
# As root or the target user
sudo mkdir -p /home/deploy/.ssh
sudo nano /home/deploy/.ssh/authorized_keys   # paste contents of zeebroo_deploy.pub
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

Give the deploy user permission to pull and restart the service:

```bash
# Own the app directory
sudo chown -R deploy:www-data /var/www/melt/melting-app
sudo chmod -R g+rX /var/www/melt/melting-app

# Passwordless restart only (safer than full sudo)
sudo visudo -f /etc/sudoers.d/melting-app-deploy
```

Add this line (replace `deploy` if you use another user):

```text
deploy ALL=(ALL) NOPASSWD: /bin/systemctl restart melting-app, /bin/systemctl is-active melting-app, /bin/systemctl status melting-app
```

If the deploy user must `git pull` as a different owner, either:

- run deploy as the user that owns the repo, or  
- use `sudo -u www-data git ...` in `scripts/deploy.sh` (adjust as needed).

Test SSH from your machine:

```bash
ssh -i ~/.ssh/zeebroo_deploy deploy@YOUR_SERVER_IP "bash /var/www/melt/melting-app/scripts/deploy.sh"
```

## 3. GitHub repository secrets

In **GitHub → Zeebroo-Team/website → Settings → Secrets and variables → Actions**, add:

| Secret | Required | Example |
|--------|----------|---------|
| `SSH_HOST` | Yes | `203.0.113.10` or `zeebroo.com` |
| `SSH_USER` | Yes | `deploy` |
| `SSH_PRIVATE_KEY` | Yes | Full private key (`zeebroo_deploy`, including `BEGIN`/`END` lines) |
| `SSH_PORT` | No | `22` |
| `DEPLOY_PATH` | No | `/var/www/melt/melting-app` (default) |
| `SERVICE_NAME` | No | `melting-app` (default) |

## 4. How deploy runs

Workflow file: [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)

On each push to `main`:

1. GitHub Actions connects to the server over SSH.
2. Runs `scripts/deploy.sh`:
   - `git fetch` + `git reset --hard origin/main`
   - `sudo systemctl restart melting-app`
   - Verifies the service is active.

Manual deploy: **Actions → Deploy to production → Run workflow**.

## 5. Troubleshooting

| Issue | Check |
|-------|--------|
| `dubious ownership in repository` | Deploy script adds `safe.directory` automatically. Or fix ownership: `sudo chown -R deploy:deploy /var/www/melt/melting-app` (use your deploy user and path) |
| SSH auth failed | `SSH_PRIVATE_KEY`, `authorized_keys`, firewall port 22 |
| `git` permission denied | Repo ownership; deploy user in correct group |
| `sudo: a password is required` | `/etc/sudoers.d/melting-app-deploy` |
| Service fails after deploy | `sudo journalctl -u melting-app -n 50` |
| Images/video 404 | Files under `public/images/` on server; Melt serves `/images/` only |
| Nginx 502 | Melt running on 8788: `curl -I http://127.0.0.1:8788/` |

## 6. First pipeline run

After adding secrets, push to `main` or run the workflow manually. Watch **Actions** tab for logs.
