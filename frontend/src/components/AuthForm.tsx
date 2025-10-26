import { CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type Props = {
  type: "login" | "signup";
  onToggleType?: () => void;
};

function AuthForm({ type, onToggleType }: Props) {
  const isLoginForm = type === "login";

  const handleGoogleOnboarding = async () => {
    if(isLoginForm){
      console.log('login with google')
    } else {
      console.log('sign up with google')
    }
  };

  const handleOnboarding = () => {
    if(isLoginForm){
      console.log('login')
    } else {
      console.log('sign up')
    }
  }

  return (
    <>
      <CardContent className="grid w-full items-center gap-4 text-white">
        <div className="flex flex-col space-y-1.5">
          <h1>Email</h1>
          <Input
            id="email"
            name="email"
            placeholder="Enter your email"
            type="email"
            className="p-2 text-white placeholder:text-zinc-500 text-base rounded-md border border-white/10 focus:outline-none focus:ring-0"
            required
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <h1>Password</h1>
          <Input
            id="password"
            name="password"
            placeholder="Enter your password"
            type="password"
            className="p-2 text-gray-200 placeholder:text-zinc-500 text-base rounded-md border border-white/10 focus:outline-none focus:ring-0"
            required
          />
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col gap-6">
        <Button className="w-full" onClick={handleOnboarding}>
          {isLoginForm ? "Login" : "Sign Up"}
        </Button>
        
        <div className="w-full">
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-background  rounded-sm">or</span>
            </div>
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleOnboarding}
          >
           <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              <span>{isLoginForm ? 'Login' : 'Sign up'} with Google</span>
            </>
          </Button>
        </div>
        
        <p className="text-xs text-white">
          {isLoginForm
            ? "Don't have an account yet?"
            : "Already have an account?"}{" "}
          <Button variant='link' className="p-0 h-auto min-h-0 text-xs leading-none align-baseline" onClick={onToggleType}>{isLoginForm? "Sign up" : "Login"}</Button>
        </p>
      </CardFooter>
    </>
  );
}

export default AuthForm;