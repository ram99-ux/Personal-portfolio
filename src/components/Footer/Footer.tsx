import { ArrowUp } from "lucide-react";
import { profile } from "@/data/site";
export function Footer() {
  return (
    <footer className="footer section-offset">
      <div>
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>Sample portfolio · Made with care.</span>
      </div>
      <a href="#home">
        Back to the beginning <ArrowUp size={16} />
      </a>
    </footer>
  );
}
