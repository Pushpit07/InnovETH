import Head from "next/head";
import HeroSection from "../components/HomePage/HeroSection";
import Section2 from "../components/HomePage/Section2";
import Section3 from "../components/HomePage/Section3";
import Section4 from "../components/HomePage/Section4";
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
				<Section3/>
				<Section4/>
			</div>
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
