import LogoWhite from "../assets/img/logo-white.svg";
export default function Footer() {
  return (
    <footer className="bg-primary py-12">
      <div className="container mx-auto text-white flex justify-between">
        <a href="/">
          <img src={LogoWhite} alt="" />
        </a>
        Copyright &copy; 2024. All rights reserved.
      </div>
    </footer>
  );
}
