import { Spinner } from './spinner';

export function FullPageSpinner() {
  return (
    <div className="h-screen text-6xl flex items-center justify-center flex-col">
      <Spinner />
    </div>
  );
}
