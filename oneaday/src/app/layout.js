// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ 
        backgroundColor: "black", 
        margin: 0, 
        color: "white",
        fontFamily: "sans-serif" 
      }}>
        {children}
      </body>
    </html>
  );
}