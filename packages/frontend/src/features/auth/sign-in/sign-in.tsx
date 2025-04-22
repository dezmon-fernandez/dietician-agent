import { AuthLayout } from '@/components/ui/auth-layout';
import { Button } from '@/components/ui/button';
import { Checkbox, CheckboxField } from '@/components/ui/checkbox';
import { Field, Label } from '@/components/ui/fieldset';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Link } from '@/components/ui/link';
import { Logo } from '@/components/logo';
import { Strong, Text } from '@/components/ui/text';
import { CALL_BACK_URL } from '@/common/constants';
import { GoogleLogo } from '@/components/svg';
import authClient from '@/lib/auth';

export default function SignIn() {
  return (
    <AuthLayout>
      <div className="grid w-full max-w-sm grid-cols-1 gap-8">
        <form action="" method="POST" className="contents">
          <Logo className="h-6 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" />
          <Heading>Sign in to your account</Heading>
          <Field>
            <Label>Email</Label>
            <Input type="email" name="email" />
          </Field>
          <Field>
            <Label>Password</Label>
            <Input type="password" name="password" />
          </Field>
          <div className="flex items-center justify-between">
            <CheckboxField>
              <Checkbox id="remember" name="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </CheckboxField>
            <Text>
              <Link to="/forgot-password">
                <Strong>Forgot password?</Strong>
              </Link>
            </Text>
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center"
          >
            <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-sm/6 font-medium">
            <span className="bg-zinc-50 px-6 text-zinc-900 dark:bg-zinc-900 sm:bg-white sm:dark:bg-zinc-800 dark:text-zinc-200">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          color="white"
          className="w-full flex justify-center items-center"
          onClick={() => {
            return authClient.signIn.social({
              provider: 'google',
              callbackURL: CALL_BACK_URL,
            });
          }}
        >
          <GoogleLogo />
          <span className="text-sm/6 font-semibold">Google</span>
        </Button>

        <Text className="text-center">
          Don't have an account?{' '}
          <Link to="/register">
            <Strong>Sign up</Strong>
          </Link>
        </Text>
      </div>
    </AuthLayout>
  );
}
