import LogoWhite from "../../assets/img/logo-white.svg";

export default function Footer() {
  return (
    <footer className="bg-primary py-12 w-full">
      <div className="max-w-screen-xl mx-auto text-white flex justify-between px-4">
        <a href="/">
          <img src={LogoWhite} alt="Logo" />
        </a>
        Copyright &copy; 2024. All rights reserved.
      </div>
    </footer>
  );
}
