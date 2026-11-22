# PETROLUSA - App de Pedidos B2B (VS Code + React + Vite + Tailwind CSS)

## Abrindo no VS Code

1. Extraia a pasta do projeto no seu computador.
2. Abra o **VS Code** e vá em **File > Open Folder...** (ou rode `code petrolusa-pedidos-app` no terminal).
3. Abra o terminal integrado no VS Code (`Ctrl + '` no Windows/Linux ou `Cmd + '` no macOS) e execute:
   ```bash
   npm install
   ```
4. Para rodar o projeto localmente:
   ```bash
   npm run dev
   ```

## Versão mobile PWA

O projeto pode ser instalado no celular pelo navegador:

```bash
npm run build
npm run preview -- --host 0.0.0.0
```

No mesmo Wi-Fi, abra no celular o endereço exibido pelo Vite, por exemplo:

```text
http://SEU-IP:4173
```

No Android, use Chrome e escolha **Instalar aplicativo** ou **Adicionar à tela inicial**.
No iPhone, use Safari e escolha **Compartilhar > Adicionar à Tela de Início**.

## Integrando com seu Backend REST

Edite `.env` (criado a partir de `.env.example`) e altere:
```env
VITE_API_URL=http://localhost:8080/api
VITE_USE_MOCK=false
```
Os endpoints esperados estão em `src/services/api.js`:
- `GET /produtos`
- `POST /pedidos`
- `GET /pedidos`
