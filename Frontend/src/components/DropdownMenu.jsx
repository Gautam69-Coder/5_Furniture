import React from 'react'
import { useState, useEffect, useMemo } from 'react'

const DropdownMenu = ({
    FurnitureCollection, MyDropdown, FurnishingCollection
}) => {

    const [TopImageName, setTopImageName] = useState('Phases Clothing Collection')
    const [TopImageURL, setTopImageURL] = useState('')
    const [SubCollection, setSubCollection] = useState(false)
    const [Collection, setCollection] = useState()
    const [Index, setIndex] = useState(0)

    const CollectionsMap = useMemo(() => [

        FurnitureCollection?.seatingCollections || FurnishingCollection?.UpholsteryCollections,
        FurnitureCollection?.tableCollections || FurnishingCollection?.CurtainsCollections,
        FurnitureCollection?.storageCollections || FurnishingCollection?.OrderCollections,
        FurnitureCollection?.bedCollections || FurnishingCollection?.CushionsCollections,
        FurnitureCollection?.furnitureByRoom || FurnishingCollection?.Bedding,
        FurnitureCollection?.furnitureByStyle || FurnishingCollection?.Rugs,
        FurnitureCollection?.readyToShip || FurnishingCollection?.Collections,
        FurnitureCollection?.furnitureSale || FurnishingCollection?.FabricsByColor,
        FurnitureCollection?.worthKnowing || FurnishingCollection?.CushionsByColor,
        FurnitureCollection?.projectsInspiration || FurnishingCollection?.WorthKnowing,

    ], [FurnitureCollection, FurnishingCollection])

    useEffect(() => {
        if (MyDropdown === 2) {
            setCollection(FurnitureCollection)

        } else if (MyDropdown === 3) {
            setCollection(FurnishingCollection)
        } else {
            setCollection(null)
        }
    }, [MyDropdown])

    if (!Collection) return null;

    return (
        <div className='absolute z-50 bg-white' >
            <div className='mx-[190.400px] pt-5 pb-3 flex   '>
                {/* Left */}
                <div className=' px-[25px] max-w-[28%] w-[319px]'>
                    <div className='pl-[9px] pb-3 text-[14px] leading-6 font-medium tracking-[1px]'>
                        {Collection.top.map((item, index) => (
                            <div className='px-[9px] py-1 hover:bg-gray-200' key={index}
                                onMouseOver={() => {
                                    setSubCollection(true)
                                    setIndex(index)
                                }}
                            >
                                {item.title}
                            </div>

                        ))}
                        <div className='mb-3'></div>
                        {Collection.mid?.length > 0 && Collection.mid?.map((item, index) => (

                            <div className='px-[9px] py-1.5 hover:bg-gray-200' key={index}
                                onMouseOver={() => {
                                    setSubCollection(true)
                                    setIndex(Collection.top.length + index)
                                }}
                            >
                                {item.title}
                            </div>

                        ))}

                        <div className='mb-3'></div>
                        {Collection.bottom?.length > 0 && Collection.bottom.map((item, index) => (

                            <div className='px-[9px] py-1.5 hover:bg-gray-200' key={index}
                                onMouseOver={() => {
                                    setSubCollection(true)
                                    setIndex(Collection.top.length + Collection.mid.length + index)
                                }}
                            >
                                {item.title}
                            </div>

                        ))}

                        <div className=''></div>
                        {Collection.last?.length > 0 && Collection.last.map((item, index) => (

                            <div className='px-[9px] py-1.5 hover:bg-gray-200' key={index}
                                onMouseOver={() => {
                                    setSubCollection(true)
                                    setIndex(Collection.top.length + Collection.mid.length + Collection.bottom.length + index)
                                }}
                            >
                                {item.title}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Middle Image*/}
                <div className={`border-r border-gray-300 border-l px-[25px] max-w-[36%] text-[17px] leading-[26px] font-normal 
                    ${SubCollection ? (
                        'bg-[#F3F3F3] '
                    ) : (
                        null
                    )}
                    `}
                >
                    {SubCollection ? (
                        CollectionsMap[Index]?.map((item, index) => (
                            <div key={index} className='w-[360px] bg-[#F3F3F3] no-underline'
                            >
                                <div className='text-[16px] leading-6 font-medium tracking-[1px] mb-2 no-underline'>{item.heading}</div>
                                <ul className='text-[13px] hover:text-[14px] leading-5 font-medium  hover:font-semibold text-[#455360] hover:ml-4 transition-all ease-in-out no-underline flex'
                                    onMouseOver={() => {
                                        setTopImageURL(item.imageURL)
                                        setTopImageName(item.collection)
                                    }}
                                >
                                    <li>{item.collection}</li>
                                </ul>
                            </div>
                        ))

                    ) : (
                        <div className='overflow-hidden hover:underline '>
                            <img loading="lazy" src={Collection.headImgUrl[0].imageURL} alt=""
                                className=' mb-2 h-96 w-[360px] object-cover transition-transform duration-500 ease-in-out hover:scale-105 cursor-pointer'
                            />
                            <div >
                                Home Decor
                            </div>
                        </div>
                    )
                    }
                </div>

                {/* Right TOP and BOTTOM Image*/}
                <div className="px-[25px] flex flex-col space-y-4 max-w-[36%] text-[17px] leading-[26px] font-normal">
                    {/* First box */}
                    <div className="mb-2 overflow-hidden hover:underline">
                        <img loading="lazy"
                            src={TopImageURL || Collection.rightTopImgUrl[0].imageURL}
                            alt={TopImageName}
                            className="mb-2 h-[165px] w-[360px] object-cover transition-transform duration-500 ease-in-out hover:scale-105 cursor-pointer"
                        />
                        <div className="text-left  ">
                            {TopImageName}
                        </div>
                    </div>

                    {/* Second box */}
                    <div className="mb-2 overflow-hidden  hover:underline">
                        <img loading="lazy"
                            src={Collection.rightBottomImgUrl[0].imageURL}
                            alt={Collection.rightBottomImgUrl[0].title}
                            className="mb-2 h-[165px] w-[360px] object-cover transition-transform duration-500 ease-in-out hover:scale-105 cursor-pointer"
                        />
                        <div className="text-left">
                            {Collection.rightBottomImgUrl[0].title}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DropdownMenu 