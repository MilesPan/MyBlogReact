import { getMediaCtx } from "../../lib/getMediaCtx";
import Image from "next/image";
import { NotionText } from "./NotionTextBlock";
import { useState } from "react";

const NotionImage = ({ value }: { value: any }) => {
  let { src: imageSrc, caption: imageCaption, expire } = getMediaCtx(value);

  const {
    size: { width, height },
  } = value;

  if (!imageSrc.includes("prod-files-secure.s3.us-west-2.amazonaws.com")) {
    imageSrc = imageSrc.split("?")[0];
  }

  return (
    <figure
      className="mx-auto my-6 max-w-11/12 rounded-2xl"
      data-aos="fade-up"
      data-aos-duration="800"
    >
      <div
        className={`${
          expire === null ? "flex justify-center" : ""
        } transition-all duration-800 ease-in-out rounded-2xl overflow-hidden relative w-full h-full`}
      >
        {width && height ? (
          expire === null ? (
            value.blur ? (
              <Image
                className="rounded-2xl overflow-hidden"
                src={imageSrc}
                alt={imageCaption}
                width={width}
                height={height}
                placeholder="blur"
                blurDataURL={value.blur}
                // onLoad={handleLoad}
              />
            ) : (
              <Image
                className="rounded-2xl overflow-hidden"
                src={imageSrc}
                alt={imageCaption}
                width={width}
                height={height}
              />
            )
          ) : (
            <img
              className="rounded-2xl overflow-hidden"
              src={imageSrc}
              alt={imageCaption}
              width={width}
              height={height}
            />
          )
        ) : (
          <img
            className="rounded-2xl overflow-hidden"
            src={imageSrc}
            alt={imageCaption}
          />
        )}
      </div>
      {imageCaption.length !== 0 && (
        <figcaption>
          <div className="my-2 text-sm text-center opacity-50 dark:opacity-70">
            {<NotionText text={imageCaption} />}
          </div>
        </figcaption>
      )}
    </figure>
  );
};

export default NotionImage;
