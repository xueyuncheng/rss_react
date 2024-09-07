
function Modal({ show, onClose, children }: { show: boolean, onClose: () => void, children: React.ReactNode }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full relative">
                <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal;
