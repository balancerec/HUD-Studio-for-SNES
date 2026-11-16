# HUD Studio for SNES

Editor visual experimental de HUDs e elementos de interface para jogos, com inspiração no fluxo de trabalho de editores de mídia como FL Studio.

> **Estado:** protótipo estático, sem compilação. O nome expressa o objetivo do projeto; a versão atual **não gera automaticamente arquivos ou código compatíveis com hardware SNES**. O editor trabalha com PNGs RGBA e canvas Full HD.

## Funcionalidades atuais

- Canvas **1920 × 1080**, zoom e background substituível (PNG/JPEG/WebP).
- Biblioteca local de sprites PNG e arrastar da biblioteca para o canvas.
- Movimentação, redimensionamento e rotação por mouse; painel de propriedades X/Y, largura/altura, rotação, opacidade e Z.
- Espelhamento horizontal/vertical, duplicação, bloqueio, visibilidade e ordenação das camadas.
- Grade visual configurável (8/16/32/64 px) e opção de snap.
- Importar/exportar projeto JSON e exportar composição PNG, com ou sem background.
- Undo básico e atalhos de teclado.

### Limitação conhecida

**A seleção por pixels visíveis (canal alpha) ainda não funciona corretamente em todos os casos.** A versão atual mantém o algoritmo experimental; para alguns sprites a área vazia/transparente ainda pode receber clique/arraste. Este comportamento deve ser corrigido e testado antes de uma versão estável. Consulte [docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md).

## Execução

**Opção A: servidor HTTP local (recomendado).** No PowerShell, dentro da pasta do projeto:

```powershell
py -m http.server 8000
```

Abra <http://localhost:8000> no navegador. Não requer `npm install`, backend ou banco de dados. Se você não tiver Python, use outro servidor HTTP estático.

**Opção B:** abrir `index.html` diretamente; algumas funções de canvas e exportação podem ser restringidas pelo navegador no protocolo `file://`.

## Estrutura

```text
HUD-Studio-for-SNES/
├── index.html                    # Aplicação HTML/CSS/JS
├── assets/                       # Sprites PNG e HUD de referência
├── docs/
│   ├── ARCHITECTURE.md
│   ├── KNOWN_ISSUES.md
│   └── ROADMAP.md
├── scripts/
│   └── publicar-github.ps1       # Script Git seguro para Windows
├── tests/
│   └── smoke-test.py             # Testes estáticos do pacote
├── .github/workflows/validate.yml
├── .gitignore
├── .gitattributes
└── README.md
```

## Testes

```powershell
py tests/smoke-test.py
```

O teste verifica a estrutura, referências aos PNGs e integridade básica dos assets. Quando `node` está disponível, também verifica a sintaxe do JavaScript embutido.

## Publicação GitHub

Repositório: https://github.com/balancerec/HUD-Studio-for-SNES

Para publicar a pasta local pela primeira vez, use [scripts/publicar-github.ps1](scripts/publicar-github.ps1) a partir da raiz. O script **não substitui commits existentes nem faz force push** e exige a opção `-Push` para enviar ao remoto.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\publicar-github.ps1
# verifique o relatório; depois publique:
powershell -ExecutionPolicy Bypass -File .\scripts\publicar-github.ps1 -Push
```

Os PNGs incluídos são recursos de referência da interface do projeto e podem conter elementos associados a Mortal Kombat. Verifique os direitos de uso/distribuição antes de licenciar ou redistribuir comercialmente esses assets. **Nenhuma licença de código aberto foi aplicada automaticamente.**
