import './globals.css';

export const metadata = {
  title: 'زرگوی - سامانه عرضه هوشمند طلا',
  description: 'داشبورد لحظه‌ای و مدیریت عرضه طلا',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased min-h-screen bg-[#030303]">
        {children}
      </body>
    </html>
  );
}
