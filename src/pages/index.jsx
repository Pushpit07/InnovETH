import Head from "next/head";
import HeroSection from "../components/HomePage/HeroSection";
import Section2 from "../components/HomePage/Section2";
import { title_main_page, meta_description } from "../constants";

function Home() {
	return (
		<>
			<Head>
				<title>{title_main_page}</title>
				<meta name="description" content={meta_description} />
			</Head>
			<HeroSection/>
			<div className="px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-36">
				<Section2/>
			</div>
			{/* <div className="w-full max-w-[1920px] px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-36"> */}
				{/* <Section2/> */}
			{/* </div> */}
			{/* <div className="relative flex flex-col items-center w-screen h-screen bg-light-200">
				<h1 className="mt-40 mb-4 text-5xl font-semibold text-center font-primary">InnovETH</h1>
				<p>Innovate & Improvise</p>
			</div> */}
		</>
	);
}

export default Home;
/*
<h1>I'm Matt, I'm a</h1>
<div class="container">
    <input name="checkboxes" type='radio' id="c1" checked/>
    <input type='radio' name="checkboxes" id="c2"/>
    <input type='radio' id="c3" name="checkboxes"/>
  <div class="typed-out" id="check1">Web Developer1</div>
  <div class="typed-out" id="check2">Web Developer2</div>
  <div class="typed-out" id="check3">Web Developer3</div>
</div>
*/
