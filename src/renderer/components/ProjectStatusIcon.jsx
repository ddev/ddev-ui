import React from 'react';

// project status Icon
const ProjectStatusIcon = props => {
  const { status } = props;
  // set default color
  let color = null;

  // determine server color based on status
  switch (status) {
    case 'running':
      color = '#00A079';
      break;
    case 'stopped':
      color = '#EF5941';
      break;
    default:
      color = '#F3DD3E';
      break;
  }

  return (
    <svg
      width="17"
      height="15"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className ? props.className : ''}
    >
      <path
        d="M15.792 4.294H1.208A1.042 1.042 0 0 1 .167 3.253V1.169C.167.594.633.128 1.208.128h14.584c.575 0 1.041.466 1.041 1.041v2.084c0 .575-.466 1.041-1.041 1.041zM14.229 1.43a.781.781 0 1 0 0 1.562.781.781 0 0 0 0-1.562zm-2.083 0a.781.781 0 1 0 0 1.562.781.781 0 0 0 0-1.562zm3.646 8.073H1.208A1.042 1.042 0 0 1 .167 8.46V6.378c0-.576.466-1.042 1.041-1.042h14.584c.575 0 1.041.466 1.041 1.042V8.46c0 .575-.466 1.042-1.041 1.042zm-1.563-2.865a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563zm-2.083 0a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563zm3.646 8.073H1.208a1.042 1.042 0 0 1-1.041-1.042v-2.083c0-.575.466-1.042 1.041-1.042h14.584c.575 0 1.041.467 1.041 1.042v2.083c0 .576-.466 1.042-1.041 1.042zm-1.563-2.865a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563zm-2.083 0a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563z"
        fillRule="nonzero"
        fill={color}
      />
    </svg>
  );
};

export default ProjectStatusIcon;
