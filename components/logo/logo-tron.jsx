import { twMerge } from "tailwind-merge";

function LogoTron({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={twMerge("w-4 aspect-square", className)} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M6.6 6.8a.43.43 0 01.42-.13l9.043 2.214a.4.4 0 01.15.07l1.84 1.342a.43.43 0 01.102.587l-6.33 9.262a.427.427 0 01-.758-.099L6.514 7.23A.43.43 0 016.6 6.8m1.492 2.312l3.16 8.897.52-4.61zm4.526 4.435l-.528 4.691 4.47-6.54zm4.345-2.986l-2.88 1.352 1.93-2.044zm-1.82-1.02l-7.03-1.72 4.122 4.8z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default LogoTron;
