import { IoMdClose } from "react-icons/io";
import { BsFillPlusCircleFill } from "react-icons/bs";
import profileImg from "../Image/profile.webp"

const Stories = ({ stories, selectedUserIndex, handleOpenStory, currentStoryIndex, progress, handleCloseStory, handleStoryClick, handleTouchStart, handleTouchEnd, imageLoading, setImageLoading, loading }) => {
    return (
        <div>
            {selectedUserIndex === null ? (
                <div className="flex items-center gap-4 overflow-x-auto p-4 scrollbar-hide">
                    <div>
                        <div className="relative">
                            <img loading='lazy' src={profileImg} alt="profile" className='w-20 h-20 rounded-full' />

                            <BsFillPlusCircleFill className="absolute bottom-0 right-0 bg-white p-0.5 rounded-full text-xl" />
                        </div>
                        <p className="text-xs text-center mt-2 w-20 truncate text-gray-600">Your story</p>
                    </div>
                    {loading ? <div className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin"></div>
                        :
                        <>
                            {stories.map((user, index) => (
                                <div
                                    key={user.id}
                                    onClick={() => handleOpenStory(index)}
                                    className="flex-shrink-0 cursor-pointer"
                                >
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5">
                                            <div className="w-full h-full rounded-full p-0.5">
                                                <img
                                                    src={user.avatar}
                                                    alt={user.username}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-center mt-2 w-20 truncate text-gray-600">{user.username}</p>
                                </div>
                            ))}
                        </>
                    }

                </div>
            ) : (
                <div className="fixed inset-0 bg-black z-50">
                    {/* Progress Bars */}
                    <div className="absolute top-0 left-0 right-0 z-20 p-2">
                        <div className="flex gap-1">
                            {stories[selectedUserIndex].stories.map((_, index) => (
                                <div key={index} className="flex-1 h-0.5 bg-gray-600 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white transition-all duration-100 ease-linear"
                                        style={{
                                            width: `${index < currentStoryIndex ? 100 :
                                                index === currentStoryIndex ? progress :
                                                    0
                                                }%`
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Story Header */}
                    <div className="absolute top-6 left-0 right-0 z-20 flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={stories[selectedUserIndex].avatar}
                                alt={stories[selectedUserIndex].username}
                                className="w-10 h-10 rounded-full border-2 border-white"
                            />
                            <div>
                                <p className="font-semibold text-sm text-white">{stories[selectedUserIndex].username}</p>
                                <p className="text-xs text-gray-300">
                                    {stories[selectedUserIndex].stories[currentStoryIndex]?.timestamp}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleCloseStory}
                        >
                            <IoMdClose className="text-white text-2xl cursor-pointer" />
                        </button>
                    </div>

                    {/* Story Image */}
                    <div
                        className="relative w-full h-full flex items-center justify-center"
                        onClick={handleStoryClick}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {imageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black">
                                <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        <img
                            src={stories[selectedUserIndex]?.stories[currentStoryIndex]?.image}
                            alt="Story"
                            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'
                                }`}
                            onLoad={() => setImageLoading(false)}
                        />

                        {/* Touch on either sides */}
                        <div className="absolute inset-0 flex">
                            <div className="w-1/3 h-full"></div>
                            <div className="w-1/3 h-full"></div>
                            <div className="w-1/3 h-full"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Stories
