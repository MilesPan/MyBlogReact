/* eslint-disable react/no-unknown-property */
import { GetStaticProps, NextPage } from "next";
import ContentLayout from "../components/layout/ContentLayout";
import ListLayout from "../components/layout/ListLayout";
import { getDatabase } from "../lib/notion";
import { Post } from "../lib/types";
import { me } from "../config/me";
import { Colors } from "../lib/colors";
import Image from "next/image";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useTheme } from "next-themes";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const CardLayout = ({ children }: any) => {
  return (
    <div
      data-aos="fade-up"
      className={`bg-white rounded-3xl border-[0.5px] border-true-gray-100 relative overflow-hidden my-5 transform rotate-0`}
      dark="bg-true-gray-900 border-true-gray-800"
    >
      <div className="m-5 xs:m-8 md:m-8">{children}</div>
    </div>
  );
};

const LocationMap = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  const emptyImage =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  let src;
  switch (resolvedTheme) {
    case "light":
      src = "/static/images/map_light.png";
      break;
    case "dark":
      src = "/static/images/map_dark.png";
      break;
    default:
      src = emptyImage;
      break;
  }

  return (
    <Image
      className="absolute left-0 z-0 -top-1/4 sm:-top-3/5 lg:-top-9/10"
      layout="fill"
      objectFit="cover"
      src={src}
      alt="map"
    />
  );
};

const Overview = () => {
  const style =
    "bg-white rounded-3xl p-4 xs:p-4.5 sm:p-6 md:p-8 min-h-25 sm:min-h-37 flex flex-col justify-between transform rotate-0 overflow-hidden dark:bg-true-gray-900";
  const social = me.social;
  const skills = me.skills;
  const education = me.education;
  const [more, setMore] = useState(false);

  const handleMore = () => {
    setMore(!more);
  };

  return (
    <div className="grid grid-cols-2 gap-3 select-none md:gap-6">
      <div
        data-aos="fade-up"
        data-aos-duration="800"
        className={`${style} bg-gradient-to-br from-[#ffa0a8] to-[#fffcdc] text-white`}
      >
        <div className="text-xs font-semibold xs:text-lg md:text-xl">
          Hey there 💕
        </div>
        <div className="text-lg font-semibold xs:text-2xl sm:text-3xl md:text-4xl whitespace-nowrap">
          {`I'm Peter Pan `}
        </div>
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="800"
        data-aos-delay="200"
        className={`${style} row-span-2 text-white bg-gradient-to-br from-green-400 to-blue-500`}
      >
        <p className="text-xs font-semibold xs:text-lg md:text-xl">
          Intersted in
        </p>
        <div className="text-center">
          <p className="text-sm font-semibold xs:text-xl sm:text-2xl md:text-3xl">
            DevOps, 前端工程化
          </p>
        </div>
        <p className="text-xs text-center sm:text-sm text-true-gray-100">...</p>
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="800"
        className={`${style} justify-between`}
      >
        <p className="text-xs font-semibold xs:text-lg md:text-xl">{`I'm a`}</p>
        <div className="text-sm font-semibold xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          <div>
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
              Developer
            </span>
            <span className="inline-block mr-2 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-500">
              &nbsp;&nbsp;&nbsp;Gamer
            </span>
          </div>
          <div>
            <span className="inline-block text-xs text-red-500 line-through xs:text-lg">
              Guitar
            </span>
          </div>
        </div>
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="800"
        data-aos-delay="200"
        className={`${style} text-center`}
      >
        <p className="text-sm font-semibold text-left xs:text-lg sm:text-xl md:text-3xl lg:text-4xl">
          Love{" "}
          <span className="text-white text-stroke-1 text-stroke-orange-500">
            Logical
          </span>
        </p>
        <p className="text-xs font-semibold xs:text-lg sm:text-xl lg:text-2xl">
          &
        </p>
        <p className="text-sm font-semibold text-right xs:text-lg sm:text-xl md:text-3xl lg:text-4xl whitespace-nowrap">
          <span className="italic text-transparent bg-gradient-to-br from-pink-300 to-purple-300 bg-clip-text">
            Exquisite
          </span>{" "}
          Things
        </p>
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="800"
        data-aos-delay="200"
        className={`bg-white rounded-3xl overflow-hidden min-h-70 row-span-1 col-span-1 sm:col-span-1 flex flex-col relative justify-between`}
        dark="bg-true-gray-900"
      >
        <p
          className={`p-4 xs:p-4.5 sm:p-6 md:p-8 text-2xl font-semibold text-left sm:text-2xl md:text-3xl lg:text-4xl z-10 z-50  line-clamp-1`}
        >
          Educations
        </p>
        <div className="flex flex-col justify-between h-full mt-1 mb-8 ">
          <div className="p-4 xs:p-4.5 sm:p-6 md:p-8 !pt-0 mb-10 sm:mb-8">
            {education.map((edu) => (
              <div className="flex items-center gap-2" key={edu.name}>
                <div
                  className={`${
                    Colors[edu.color].bg.msg
                  } aspect-square h-3 rounded-full lg:h-4`}
                />
                <p className="text-sm text-true-gray-400 lg:text-lg">
                  {edu.degree}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col h-full items-center justify-end pb-4 xs:pb-4.5 sm:pb-6 md:pb-8">
            <div className="bg-true-gray-300 w-full h-1.5 relative">
              <div className="absolute px-4 xs:px-4.5 sm:px-6 md:px-8 grid grid-cols-10 w-full -top-6 lg:-top-10 items-end">
                <div className="flex flex-col col-span-5 gap-1 lg:gap-2">
                  <a
                    className="filter hover:brightness-110"
                    href="http://www.njupt.edu.cn/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div
                      className={`h-4 lg:h-6 ${Colors["blue"].bg.msg} rounded-full w-full relative ${Colors["blue"].text.msg}`}
                      before="content-DEFAULT text-transparent absolute w-1/4 rounded-r-full h-full bg-blue-100 top-0 right-0"
                      after="absolute content-🇨🇳NJUPT tracking-wide font-semibold absolute -top-6 left-2"
                    />
                  </a>
                  <a
                    className="filter hover:brightness-110"
                    href="https://www.nyit.edu/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div
                      className={`h-4 lg:h-6 ${Colors["yellow"].bg.msg} ${Colors["yellow"].text.msg} rounded-full w-full relative`}
                      after="absolute content-🇺🇸NYIT tracking-wide font-semibold absolute top-5 lg:top-6 left-2"
                    />
                  </a>
                </div>
                <div className="col-span-2" />
                <a
                  className="col-span-3 filter hover:brightness-130"
                  href="https://www.northeastern.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    className={`h-4 lg:h-6 ${Colors["red"].bg.msg} ${Colors["red"].text.msg} rounded-full w-full relative`}
                    after="absolute content-🇺🇸NEU tracking-wide font-semibold absolute -top-6 left-0"
                  />
                </a>
              </div>
            </div>
            <div className="w-full px-4 xs:px-4.5 sm:px-6 md:px-8 grid grid-cols-10 text-true-gray-300">
              <div className="flex flex-col items-stretch justify-center col-span-4">
                <div
                  className="mt-1 h-10 w-0.5 bg-true-gray-300 relative rounded-full"
                  after="content-2016 absolute -bottom-6 -left-4"
                />
              </div>
              <div className="flex flex-col items-end justify-center">
                <div
                  className="mt-1 h-10 w-0.5 bg-true-gray-300 rounded-full relative"
                  after="content-2020 absolute -bottom-6 -left-4"
                />
              </div>
              <div className="flex flex-col items-end justify-center col-span-2">
                <div
                  className="mt-1 h-10 w-0.5 bg-true-gray-300 rounded-full relative"
                  after="content-2021 absolute -bottom-6 -left-4"
                />
              </div>
              <div className="flex flex-col items-end justify-center col-span-3">
                <div
                  className="mt-1 h-10 w-0.5 bg-true-gray-300 rounded-full relative"
                  after="content-2022 absolute -bottom-6 -left-6 sm:-left-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="800"
        className={`${style} col-span-2 gap-3  relative !flex-row items-center`}
      >
        <p className="z-10 text-sm font-semibold text-left xs:text-lg sm:text-2xl md:text-3xl lg:text-4xl whitespace-nowrap">
          Find me on 👉
        </p>
        <div className="flex items-center justify-center gap-0 my-4 text-white sm:gap-1 md:gap-1 lg:gap-2">
          {social.map((s: any) => (
            <a
              last-after="absolute content-. text-transparent  w-4 h-4 rounded-full bg-red-500 right-0 top-0"
              last-before="absolute content-. text-transparent  w-4 h-4 animate-ping  rounded-full bg-red-400 right-0 top-0"
              target="_blank"
              rel="noopener noreferrer"
              className={`relative shadow-inner translate-y-5 even:(-translate-y-5) -ml-3 sm:ml-0  rounded-full p-3 sm:p-4 md:p-5 lg:p-6  flex justify-center items-center transform transition ease-in-out duration-200 hover:scale-105 md:hover:scale-95 aspect-ratio h-full bg-gradient-to-tr text-white  shadow-lg-middle dark:shadow-none ${s.shadow} ${s.color} `}
              href={s.url}
              key={s.name}
            >
              <s.icon
                className={`h-3 w-3 xs:(h-4 w-4) sm:(w-5 h-5) lg:(w-6 h-6) fill-white`}
              ></s.icon>
            </a>
          ))}
        </div>
      </div>
      <div
        data-aos="fade-up"
        data-aos-duration="800"
        className={`bg-white rounded-3xl overflow-hidden min-h-25 sm:min-h-37 col-span-2  flex flex-col relative justify-between`}
        dark="bg-true-gray-900"
      >
        <div
          className={`absolute transition duration-200  ease-in-out h-full w-full bg-true-gray-900 z-40 rounded-3xl text-white ${
            more ? "opacity-100" : "opacity-0"
          } overflow-auto scrollbar-hide justify-between flex flex-col`}
        >
          <p
            className={`p-4 xs:p-4.5 sm:p-6 md:p-8  text-sm font-semibold text-left xs:text-lg sm:text-2xl md:text-3xl lg:text-4xl z-50 line-clamp-1 text-transparent`}
          >
            Technical Skills
          </p>
          <div className="flex flex-col justify-end items-start w-full p-4 xs:p-4.5 sm:p-6 md:p-8 gap-3 lg: gap-4">
            {skills.map((skill: any, index: number) => (
              <div className="flex flex-wrap gap-1 lg:gap-3" key={index}>
                {skill.map((s: any, i: number) => (
                  <div
                    className="flex flex-row gap-1 text-xs xs:text-sm md:text-normal lg:text-lg place-items-center"
                    key={s.name + i.toString()}
                  >
                    <s.icon
                      className={`w-3 h-3 lg:(w-5 h-5) p-1 rounded-full ${s.color}`}
                    />
                    {s.name}
                  </div>
                ))}
                ...
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-row items-center justify-between p-4 xs:p-4.5 sm:p-6 md:p-8">
          <p
            className={`text-2xl font-semibold text-left sm:text-2xl md:text-3xl lg:text-4xl z-10 z-50  line-clamp-1 ${
              more ? "text-white dark:text-black" : "text-black dark:text-white"
            }`}
          >
            Technical Skills
          </p>
          <div
            className={`h-full aspect-square grid place-items-center transition duration-500  ease-in-out z-50 hover:cursor-pointer transform ${
              more
                ? "rotate-45 bg-white text-black hover:bg-true-gray-200"
                : "rotate-0 bg-black text-white hover:bg-true-gray-500"
            } rounded-full`}
            onClick={handleMore}
            dark="bg-true-gray-900"
          >
            <FontAwesomeIcon
              className="md:(transform scale-150)"
              icon={faPlus as IconProp}
            />
          </div>
        </div>
        <div className="pb-4 xs:pb-4.5 sm:pb-6 lg:pb-8">
          {skills.map((s: any, i: number) => (
            <div className={`${i === 1 ? "my-1 md:my-1 lg:my-2" : ""}`} key={i}>
              <div className="w-[1560px] animate-scroll-md lg:(w-[2200px] animate-scroll-lg) flex justify-between">
                {Array(20)
                  .fill(0)
                  .map((_, index) => s[index % s.length])
                  .map((s, s_i) => (
                    <div
                      className={`w-[78px] mx-[4px] h-[70px] rounded-xl lg:(w-[110px] mx-[5px] h-[100px] rounded-3xl) text-white grid place-items-center ${
                        s.color
                      } ${
                        i === 1
                          ? "transform -translate-x-5 sm:-translate-x-10 lg:-translate-x-15"
                          : ""
                      }`}
                      key={s.name + s_i.toString()}
                    >
                      <s.icon className="w-9 h-9 lg:(w-12 h-12)"></s.icon>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectHero = () => {
  const project = me.projects[0];
  return (
    <div
      className="relative flex flex-col items-center justify-center py-10 overflow-hidden bg-white md:pb-5"
      dark="bg-true-gray-900"
    >
      <h1
        data-aos="fade-up"
        className={`${Colors["purple"].text.msg} text-4xl lg:text-6xl mb-15 font-bold text-center text-stroke-sm text-stroke-purple-500 uppercase text-transparent write-vertical-right  absolute right-2 top-4 md:(right-5 top-10)`}
      >
        Project
      </h1>
      <div
        data-aos="fade-up"
        className="mt-10 mb-4 shadow-md aspect-ratio w-15 xs:w-20 rounded-2xl"
        id="hero"
      >
        <Image
          className="rounded-2xl"
          src={project.icon}
          layout="responsive"
          width="100"
          height="100"
          alt={project.name}
        />
      </div>
      <p data-aos="fade-up">{project.name}</p>
      <p
        data-aos="fade-up"
        className="my-4 text-3xl font-bold text-center max-w-120 md:text-4xl md:max-w-150"
      >
        {project.description}
      </p>
      <p
        data-aos="fade-up"
        className="px-3 py-1 text-blue-400 border-blue-400 rounded-full border-3"
      >
        {project.tip}
      </p>
      <div data-aos="fade-up" className="flex justify-center">
        <div className="flex w-full mt-8" id="astraios-images">
          {project.images?.map((image: string) => (
            <div
              className="mx-4 relative odd:(mt-[40px] will-change-transform ease-in-out transition-all) md:odd:mt-[60px]"
              key={image}
            >
              <div className="absolute top-[8px] left-[9px] w-[144px] h-[314px] md:(w-[198px] h-[428px] top-[13px] left-[12px]) lg:(w-[268px] h-[580px] top-[15px] left-[17px])">
                <Image
                  src={image}
                  alt={project.name}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="relative -mr-[109px] -ml-[2px] -mb-[117px] w-[274px] h-[410px] md:(-mr-[149px] -ml-[4px] -mb-[86px] w-[376px] h-[558px]) lg:(-mr-[200px] -ml-[2px] -mb-[100px] w-[504px] h-[752px])">
                <Image
                  src="/static/images/iphone_case_shadow.png"
                  alt={project.name}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Project = () => {
  const project = me.projects[1];
  return (
    <div className="lg:mx-20">
      <CardLayout>
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex flex-col justify-start h-70 md:h-120 md:m-4">
            <h1
              className={`text-2xl sm:text-3xl font-bold ${Colors["purple"].text.msg}`}
            >
              Project
            </h1>
            <div className="flex flex-col items-start justify-center h-full">
              <div className="flex flex-row-reverse items-center gap-3 md:flex-col md:items-start">
                <div className="mb-4 aspect-ratio w-15 xs:w-20">
                  <div
                    className="border-true-gray-100 border-1 rounded-xl lg:(rounded-2xl) shadow-md"
                    dark="border-true-gray-800"
                  >
                    <Image
                      src={project.icon}
                      alt="pokemon"
                      layout="responsive"
                      width="100"
                      height="100"
                    />
                  </div>
                </div>
                <h2 className="mb-2 text-2xl font-bold xs:text-3xl md:text-4xl lg:text-5xl">
                  {project.name}
                </h2>
              </div>
              <p className="font-medium text-normal xs:text-lg lg:text-xl text-true-gray-400">
                {project.description}
              </p>
            </div>
          </div>
          {project["video"] ? (
            <div
              className="-top-1 md:top-0 relative h-120 w-full -left-9 xs:-left-1.5 sm:left-0"
              data-aos="fade-up"
            >
              <div className="absolute h-150 w-99.5 -top-0.9 left-7.9 md:left-4.2 lg:left-13.7">
                <Image
                  className="absolute z-10 top-4 left-10"
                  src="/static/images/iphone_case_shadow.png"
                  alt={project.name}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <video
                className="absolute z-0 w-53 left-11.5 top-3 md:(left-8) lg:(top-3 left-17.5 w-53)"
                src={project["video"]}
                playsInline
                autoPlay
                loop
                muted
              ></video>
            </div>
          ) : null}
        </div>
      </CardLayout>
      <div data-aos="fade-up" className="flex justify-center">
        <a
          className={`transition-all duration-200 ease-in-out transform ${Colors["purple"].text.msg} bg-white hover:text-white hover:bg-purple-500 border-2 border-purple-500 rounded-full`}
          href={me.social[0].url}
          target="_blank"
          rel="noopener noreferrer"
          dark="bg-true-gray-900 hover:bg-purple-500"
        >
          <p
            className={`text-sm font-semibold inline-block text-center px-4 py-3`}
          >
            Explore More
          </p>
        </a>
      </div>
    </div>
  );
};

const Me: NextPage<{ posts: Post[] }> = ({ posts }) => {
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const handleScroll = () => {
    const navBar = document.getElementById("navbar");
    const hero = document.getElementById("hero");
    const imagesBounding = document.getElementById("astraios-images");
    const images = document.querySelectorAll(
      "#astraios-images > :nth-child(odd)"
    );

    images.forEach((image: any) => {
      if (hero!.getBoundingClientRect().top - navBar!.clientHeight <= 0) {
        image.style.transform = `translateY(-${
          (window.scrollY - imagesBounding!.getBoundingClientRect().bottom) / 40
        }px)`;
      }
    });
  };

  return (
    <>
      <ListLayout>
        <div data-aos="fade-up" className="flex flex-col items-center messages">
          <div className="relative my-4 overflow-hidden rounded-full aspect-square h-30 xs:h-35 md:h-40 xs:my-8 md:mt-10">
            <Image
              src="/static/images/portrait.png"
              layout="fill"
              objectFit="cover"
              alt="Portrait"
            />
          </div>
          <h1 className="pb-4 text-4xl font-bold text-center md:text-6xl">
            About Me 🌍
          </h1>
        </div>
      </ListLayout>
      <div className="px-4 mx-auto my-6 lg:px-11 md:px-5 md:w-screen-md lg:w-screen-lg">
        <Overview />
      </div>
      {/* <ProjectHero /> */}
      <ListLayout>
        <div className="my-10">
          <Project />
        </div>
      </ListLayout>
    </>
  );
};

export default Me;
