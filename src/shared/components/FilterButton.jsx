
export default function FilterButton({ onClick }) {

    return (

        <button
            type="button"
            onClick={onClick}
            className="btn bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
        >

            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="size-5"
            >

                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4.5h18l-7.5 8.25v5.25l-3 1.5v-6.75L3 4.5z"
                />

            </svg>

            Filtrar

        </button>

    );

}