FROM node:14.15.4-slim

RUN apt update && apt install -y \
    git \
    zsh \
    curl \
    wget

USER node

RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.1.2/zsh-in-docker.sh)" -- \
  -t https://github.com/denysdovhan/spaceship-prompt \
  -p git \
  -p https://github.com/z-shell/F-Sy-H \
  -p https://github.com/zsh-users/zsh-autosuggestions \
  -p https://github.com/zsh-users/zsh-completions \
  -a 'SPACESHIP_PROMPT_ORDER=(venv user dir host git hg exec_time line_sep vi_mode jobs exit_code char)' \
  -a 'SPACESHIP_USER_SHOW="aways"' \
  -a 'SPACESHIP_PROMPT_ADD_NEWLINE="false"' \
  -a 'SPACESHIP_CHAR_SYMBOL="[container] ❯"' \
  -a 'SPACESHIP_CHAR_SUFFIX=" "'

RUN mkdir /home/node/app

WORKDIR /home/node/app

CMD ["tail", "-f", "/dev/null"]