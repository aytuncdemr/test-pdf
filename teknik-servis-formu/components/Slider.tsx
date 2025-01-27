"use client";

import {
    faChevronDown,
    faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Slider({ images }: { images: Blob[] }) {
	const [activeIndex, setActiveIndex] = useState<number>(images.length - 1);

	useEffect(() => {
		setActiveIndex(images.length - 1);
	}, [images]);

	return (
		<div className="slider flex flex-col gap-2 items-center">
			<FontAwesomeIcon
            className="text-2xl border py-2 px-2 rounded-full"
				onClick={() => {
					setActiveIndex((prevState) => {
						if (prevState - 1 < 0) {
							return images.length - 1;
						}

						return prevState - 1;
					});
				}}
				icon={faChevronUp}
			></FontAwesomeIcon>

			<Image
				key={activeIndex}
				src={URL.createObjectURL(images[activeIndex])}
				alt={`image-${activeIndex}`}
				width={1920}
				height={1080}
				layout="responsive"
			></Image>

			<FontAwesomeIcon
                        className="text-2xl border py-2 px-2 rounded-full"

				onClick={() =>
					setActiveIndex((prevState) => {
						if (prevState + 1 > images.length - 1) {
							return 0;
						} else {
							return prevState + 1;
						}
					})
				}
				icon={faChevronDown}
			></FontAwesomeIcon>
		</div>
	);
}
