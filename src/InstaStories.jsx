import { useEffect, useState, useRef } from 'react';
import { LuHeart, LuPlus, LuSquarePlay, LuSearch } from "react-icons/lu";
import { GoHomeFill } from "react-icons/go";
import { BsSend } from "react-icons/bs";

import Stories from './components/Stories';

const InstaStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserIndex, setSelectedUserIndex] = useState(null);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const progressInterval = useRef(null);
    const touchStartX = useRef(null);

    // fetching stories data from /public/data.json
    const handleStoriesApi = async () => {
        setLoading(true)
        try {
            const response = await fetch('/data.json');
            const data = await response.json();
            setStories(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleStoriesApi()
    }, [])

    const handleNextStory = () => {
        if (selectedUserIndex === null) return;

        const currentUser = stories[selectedUserIndex];
        if (currentStoryIndex < currentUser.stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
            setImageLoading(true);
        } else if (selectedUserIndex < stories.length - 1) {
            setSelectedUserIndex(prev => prev + 1);
            setCurrentStoryIndex(0);
            setImageLoading(true);
        } else {
            handleCloseStory();
        }
    };

    const handlePrevStory = () => {
        if (selectedUserIndex === null) return;

        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
            setImageLoading(true);
        } else if (selectedUserIndex > 0) {
            const prevUserIndex = selectedUserIndex - 1;
            setSelectedUserIndex(prevUserIndex);
            setCurrentStoryIndex(stories[prevUserIndex].stories.length - 1);
            setImageLoading(true);
        }
    };

    const handleStoryClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;

        if (x < width / 3) {
            handlePrevStory();
        } else if (x > (width * 2) / 3) {
            handleNextStory();
        }
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (!touchStartX.current) return;

        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                handleNextStory();
            } else {
                handlePrevStory();
            }
        }

        touchStartX.current = null;
    };

    const handleOpenStory = (userIndex) => {
        setSelectedUserIndex(userIndex);
        setCurrentStoryIndex(0);
        setImageLoading(true);
        setProgress(0);
    };

    const handleCloseStory = () => {
        setSelectedUserIndex(null);
        setCurrentStoryIndex(0);
        setProgress(0);
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
        }
    };

    useEffect(() => {
        if (selectedUserIndex !== null) {
            setProgress(0);
            progressInterval.current = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        handleNextStory();
                        return 0;
                    }
                    return prev + 2; // 5 seconds interval
                });
            }, 100);

            return () => {
                if (progressInterval.current) {
                    clearInterval(progressInterval.current);
                }
            };
        }
    }, [selectedUserIndex, currentStoryIndex]);

    return (
        <main>
            {/* header */}
            <div className='flex items-center justify-between p-4'>
                <LuPlus className='text-2xl' />
                <h1 className='text-2xl font-medium italic'>Instagram</h1>
                <LuHeart className='text-xl' />
            </div>

            {/* Stories */}
            <Stories stories={stories} selectedUserIndex={selectedUserIndex} handleOpenStory={handleOpenStory} currentStoryIndex={currentStoryIndex} progress={progress} handleCloseStory={handleCloseStory} handleStoryClick={handleStoryClick} handleTouchStart={handleTouchStart} handleTouchEnd={handleTouchEnd} imageLoading={imageLoading} setImageLoading={setImageLoading} loading={loading} />


            {/* footer */}
            <div className='absolute bottom-0 max-w-md w-full border-t border-gray-200'>
                <div className='flex items-center justify-between p-4 '>
                    <GoHomeFill className='text-2xl' />
                    <LuSquarePlay className='text-2xl' />
                    <BsSend className='text-2xl' />
                    <LuSearch className='text-2xl' />
                    <img loading='lazy' src="https://media.licdn.com/dms/image/v2/D4D03AQFcmjmz0Lib7Q/profile-displayphoto-shrink_800_800/B4DZZtYkErH4Ag-/0/1745591878522?e=1761782400&v=beta&t=OWcMB4SqWI74QUlqewnJTAk-_zfbj38Di0WkoSz_GYE" alt="profile" className='w-7 rounded-full' />
                </div>
            </div>
        </main>
    )
}

export default InstaStories
