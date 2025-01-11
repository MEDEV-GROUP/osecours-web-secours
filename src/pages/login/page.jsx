import { LoginForm } from "../../components/login-form"; // Named import for LoginForm
import image from "../../assets/image-1.png"; // Importing the image

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Section Image */}
      <div className="relative hidden bg-muted lg:block">
        <img
          src={image} // Chemin de l'image
          alt="Background image"
          className="absolute inset-0 w-full h-full object-cover dark:brightness-[0.2] dark:grayscale"
        />

      </div>

        {/* Section Form */}
        <div className="flex flex-col gap-4 p-6 md:p-10 bg-gray-50">
          {/* Header */}
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium"></a>
          </div>

          {/* Login Form */}
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-lg">
              <LoginForm className="" /> {/* Rendering LoginForm */}
            </div>
          </div>
        </div>
      </div>
      );
}
