# Pokedex React Native

Aplicativo mobile feito com Expo, React Navigation, PokeAPI e Firebase Firestore.

## O que foi implementado

- Navegacao roteada com React Navigation:
  - `Home`: lista e busca Pokemon pela PokeAPI.
  - `Details`: detalhes do Pokemon e botao para favoritar.
  - `Favorites`: lista os favoritos salvos no Firestore.
- API externa gratuita: PokeAPI via `fetch`.
- CRUD completo no Firestore:
  - Create: botao `Favoritar Pokemon`.
  - Read: tela `Favoritos salvos`.
  - Update: botao `Editar` e `Salvar`.
  - Delete: botao `Excluir`.
- Animacao com `Animated`: imagem do Pokemon pulsando na tela de detalhes.

## Configurar Firebase

1. Crie um projeto no Firebase Console.
2. Crie um app Web dentro do projeto.
3. Copie o objeto `firebaseConfig`.
4. Substitua os valores em `src/firebase/config.js`.
5. Ative o Firestore Database.

Para testes academicos sem login, voce pode iniciar o Firestore em modo de teste.
Se precisar colar regras manualmente:

```txt
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /favorites/{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Rodar

```bash
npm install
npm start
```

