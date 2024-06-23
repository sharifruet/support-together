import React from 'react';
import { ReactComponent as AddIcon } from '../../assets/svgIcons/add.svg';

const OpenModalButton = ({ label, icon }) => {
    return (
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-start w-100">
            <div
                style={{ background: "#303031" }}
                className="cursor-pointer rounded-full p-2 flex items-center justify-center text-gray-100 font-semibold text-sm uppercase"
            >
                <span className="w-6 h-6 text-gray-100 mr-2">{icon}</span>
                {label}
            </div>
        </div>
    );
};

export default OpenModalButton;

// import React from 'react';
// import { ReactComponent as AddIcon } from '../../assets/svgIcons/add.svg';

// const OpenModalButton = ({ label, icon }) => {
//   return (
//     <button
//       type="button"
//       className="btn btn-rounded mt-5 px-2 shadow-sm hover:shadow-md focus:outline-none text-white font-semibold uppercase text-sm sm: w-100"
//       data-mdb-ripple-init
//     >
//       <span className="w-6 h-6">{icon}</span>
//       {label}
//     </button>
//   );
// };

// export default OpenModalButton;

