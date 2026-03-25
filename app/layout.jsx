// app/layout.jsx
export const metadata = {
  title: "Botanik — Rozpoznaj svoju kvetinu",
  description: "Ofoť kvetinu, rozpoznáme ju a pripomenieme ti polievanie.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sk">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Nunito:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
