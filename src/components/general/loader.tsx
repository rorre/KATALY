import { Fragment, FunctionalComponent, h, ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';

interface LoaderProps {
  children: ComponentChildren;
}

// This object exists just to aid react rendering stuff
const Loader: FunctionalComponent<LoaderProps> = ({ children }) => {
  const [isLoading, setLoading] = useState(true);
  const [isGone, setGone] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1250);
    setTimeout(() => setGone(true), 1750);
  }, []);

  return (
    <Fragment>
      <div
        className={
          'fixed top-0 left-0 z-50 h-screen w-screen bg-gray-800  ' +
          'flex flex-col items-center justify-center transition-opacity duration-300 ' +
          (isLoading ? 'opacity-100 ' : 'opacity-0 ') +
          (isGone && 'hidden')
        }
      >
        <i class="fas fa-circle-notch fa-3x animate-spin text-white" />
      </div>
      <div
        className={'z-0 ' + (isLoading && 'h-screen w-screen overflow-hidden')}
      >
        {children}
      </div>
    </Fragment>
  );
};

export default Loader;
