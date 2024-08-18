type IconProps = React.HTMLAttributes<SVGElement>;
export const Icons = {
  nike: (props: IconProps) => (
    <svg viewBox="0 0 146.2 51" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        d="M146.2 0L39.3 45.3C30.4 49.1 22.9 51 16.9 51c-6.8 0-11.7-2.4-14.8-7.2-3.9-6.2-2.2-16.1 4.5-26.6 4-6.1 9.1-11.7 14.1-17.1C19.5 2 9.2 19.2 20.5 27.3c2.2 1.6 5.4 2.4 9.3 2.4 3.1 0 6.7-.5 10.7-1.5L146.2 0z"
      />
    </svg>
  ),
};
