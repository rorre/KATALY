import { FunctionalComponent, h, ComponentChildren } from 'preact';
import { useRef } from 'preact/hooks';

interface ModalProps {
  show: boolean;
  setShow: (arg0: boolean) => void;
  title: string;
  children?: ComponentChildren;
}

const Modal: FunctionalComponent<ModalProps> = ({
  show,
  setShow,
  title,
  children,
}) => {
  const outerModal = useRef<HTMLDivElement>(null);
  const innerModal = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={outerModal}
      className={`fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-40 p-8
                 px-4 sm:px-16 md:px-32 lg:px-64 
        ${show ? 'block opacity-100' : 'hidden opacity-0'}`}
      onClick={(event) => {
        if (event.target == outerModal.current) {
          setShow(false);
        }
      }}
    >
      <div
        ref={innerModal}
        className="relative mx-auto w-full max-w-sm animate-[falling_0.4s] bg-gray-200 p-4"
      >
        <span
          className="absolute top-2 right-3 cursor-pointer text-4xl"
          onClick={() => setShow(false)}
        >
          &times;
        </span>
        <div className="flex flex-col space-y-4">
          <p className="font-sans text-lg font-bold">{title}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
