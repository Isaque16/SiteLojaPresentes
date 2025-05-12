import { Cart, UserAvatar } from "@/components";

export default function Footer() {
  return (
    <>
      <div className="md:hidden bg-base-100 menu menu-horizontal fixed w-full h-16 flex flex-row justify-around px-4 items-center shadow-md bottom-0 rounded-tl-box rounded-tr-box">
        <Cart />
        <UserAvatar />
      </div>
      <footer className="footer p-5 bg-base-100 border-t-2 border-white mt-5">
        <address>
          <p>Tel. </p>
          <p>Email. </p>
          <p>Endereço. </p>
          <p>CNPJ. </p>
        </address>
      </footer>
    </>
  );
}
