# Sections
- [List of game projects](https://chrisglein.github.io/games)
- [Rum Runner](https://chrisglein.github.io/rum-runner)
- [GitHub Dashboard tool](https://chrisglein.github.io/github-dashboard)
- [This index](https://chrisglein.github.io/)

# Development

## Machine Setup

### Install WSL
[More Info](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll)
```cmd
wsl --install Ubuntu
```

Reboot!

### Set Up Bundle
```bash
sudo snap install ruby --classic
gem install bundler
sudo apt install build-essential
bundle install
```

## Testing locally

```cmd
bash
bundle exec jekyll serve
```

To see draft posts, instead:

```bash
bundle exec jekyll serve --drafts
```