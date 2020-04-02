import React from "react";

const CaretLeft = props => (
  <svg
    height={props.height}
    width={props.width}
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="caret-left"
    class="svg-inline--fa fa-caret-left fa-w-6"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 192 512"
  >
    <path
      fill="currentColor"
      d="M192 127.338v257.324c0 17.818-21.543 26.741-34.142 14.142L29.196 270.142c-7.81-7.81-7.81-20.474 0-28.284l128.662-128.662c12.599-12.6 34.142-3.676 34.142 14.142z"
    ></path>
  </svg>
);

CaretLeft.defaultProps = {
  height: 16,
  width: 16
};

export default CaretLeft;
