import { BookOpen} from "lucide-react";

import { LoginForm } from "@/app/components/login-form";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"
          >
            <div className="bg-indigo-600 text-primary-foreground flex size-7 items-center justify-center rounded-md">
              <BookOpen className="size-4" />
            </div>
            Taruna Library
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          width={720}
          height={720}
          src="/Login-img.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
