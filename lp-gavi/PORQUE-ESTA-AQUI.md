# Por que estes arquivos estão aqui

Este diretório é uma cópia de transporte. O código pertence ao repositório
`edusousarj-beep/lp-gavi`, e é lá que ele deve viver.

A sessão que gerou isto não conseguiu dar push no `lp-gavi`: o app do Claude no
GitHub não tem acesso a esse repositório, e o push volta com 403. Para liberar,
um admin instala o app em https://github.com/apps/claude/installations/select_target
ou religa o GitHub em https://claude.ai/customize/connectors

Enquanto isso não acontece, para mover à mão:

```sh
git clone https://github.com/edusousarj-beep/lp-gavi
cd lp-gavi
git checkout -b claude/edusousarj-beep-lp-gavi-au0nrf
cp -r <este-diretorio>/{index.html,assets,README.md} .
git add -A && git commit -m "Hero da LP e mecânica do botão do SDR"
git push -u origin claude/edusousarj-beep-lp-gavi-au0nrf
```

O `README.md` aqui do lado descreve o que foi implementado e o que falta.
