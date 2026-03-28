# 네온 스피너

정적 파일만 사용합니다 (`index.html`, `app.js`, `style.css`). 별도 빌드가 없습니다.

## GitHub Pages

1. GitHub에 새 저장소를 만든 뒤 이 폴더를 푸시합니다.
2. 저장소 **Settings → Pages**에서 **Source**를 **Deploy from a branch**로 두고, **Branch**는 `main` / 폴더는 **`/(root)`** 를 선택합니다.
3. 1~2분 뒤 `https://<사용자명>.github.io/<저장소이름>/` 에서 확인합니다.

`index.html`이 루트에 있으면 됩니다.

## Netlify

- [app.netlify.com](https://app.netlify.com) → **Add new site** → **Deploy manually** 로 `spinner` 폴더 전체를 드래그 앤 드롭하거나,
- GitHub와 연결해 같은 저장소를 선택합니다. 빌드 명령·출력 디렉터리는 비워 두면 됩니다.

## Vercel

```bash
npm i -g vercel
cd spinner
vercel
```

프로젝트 루트에 `index.html`이 있으면 자동으로 정적 사이트로 배포됩니다.

## Cloudflare Pages

Dashboard → **Workers & Pages** → **Create** → **Upload assets** 로 폴더를 업로드하거나 GitHub를 연결합니다. 빌드 설정은 비워 둡니다.
