import Image from "next/image";
import HubCard from "./HubUtils/HubCard";

export default function HubBody({ proposals }) {
	const data = [
		{
			title: "Moralis Hires Full Time Developers [NodeJS + Linux + Devops + RabbitMQ]",
			body: `We are going to 3-5x our team this year.
            We need senior developers.
            Join us on this quest!!
            
            Watch this video to apply:`,
			author: "Ivan",
			videoUrl: "",
			authorAvatar:
				"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATgAAAChCAMAAABkv1NnAAABlVBMVEX////c3Nz4+fra2trz8/P8/Pzl5eXt7e3p6en39/etsrV4gIfi4uLe3t4AAABqc3xjbHRkbXVbZW9zYlb///b///re4eShl4MAAAp/ho20uLxOX3EeL0iCgoPO0NJKJwCZjnOQnq7IyMjm6u6ywtCVpa/59Oji3dmjtsBkYV+glInOxsHAyM6hrrfHua3W09CLdWayn5KNfnHb18rVy75vb3Xd5/Fgbn6im5ZdXWmnqKiupJkAwZe9xM2/vLt8kqRzX0sGOmQZAABWOSIMFRvC1eAiKC0KKkUTFQ4jR2wyGAC+rZwuN0EwLCdcdIk2CwBER0sACzInGgsAABkuUnAAJjNBOS0iAAA9OzgABDdWSDsTHy1ofpZqUzswR19FMiB+aVIAGzYgPlRtg59PZ4JXUk8zAABfSSlujZyNkqO7samdkZN2alAlICEeJj1WTleUm6OXraw1QlKQgnYAGi63qrV7hYNUS0YYCiQ8N0JrWUuBeX3cxK9NMS04LUfv3Muxtak7U12JioG86t2Z3slm0rV31boc+azxAAAQuUlEQVR4nO2djX/aRpqAByFGAkYYYyMHHNQiBEIgkAEBsggiTapmW6eu+3FtziGp26vvGjlpdObSXNd7a8f9+Lt3JLCTtG4aZMfO4XmCJY00dqQno5n3HSk/A0AgEAgEwoUSod4cF31tb5Q3KS5y0Rf3JjlRXOSl1V8Luqzi8MpbHF+/3Pc3IxZ/kg7gV3+BqEVfTnHg3SsDAK5fkSbmQOU930z6Rhn80Qa4+f6V7kt65IR9cpubfXEf3AKlK3+TAM0AiqGoyofeFp3+qAwiDAUYGu+MMlE6Qnst8528fCMfpWh8AO+lIvgwBaK4Pk3RtF+fiuDNSyFu7oa91v1Iqt/+eB18svFp78P9hN1IfPC3svxZ4nN7a72UKK990fi3LxPlCBZXW/yqeG8jwX+5cTWUsPcTWsLW37+zvvbv4JP1/QS9uXG3c3030bkM4oYrg3v9ryTGOkxQ7wxB5f7X5cWElP5Kur4ORl/o79VvD5vltVtgax3gWzWRWAbXl8HSt+ZH5a3B2helROedbi8hJLQ7V+vra9+YXw9W7oNL0eLW9fe/idyQ7g10LK6MxW0OfHHle0Ow9GHpimJd3ews3Qcrnrh38nh8uDcA734rCJ36e/fKWNwnA0Gkbiq1rxWpcQvv3vqPyyHuO3BjmE5IW3e3E9R/5vHgsJ+Qmok7ibKe+CBhg5ufgk9u4RYGtr7D4nAFCvzX90C+sfFxp5T4nNpPdNYS2/fBUqKzkuiUPtv9uHN9eBnEUWwhAukIoiNclKdQgWJ4AHmA8CaIcjhKYwoRXIXh8RLXRt4CFqhIlCtEIrCA1zRgOIqiea9OJMIVgF9x9sWdGEr8Rfl1uJTizoKLvjYCgUAgEAgEAoFAOBvU+OsDL/pkYyeeVuZCziU+N5+aSybnTib54uZ89kLO8AVSc/MnnGqKvYhzycxLpZQtp5JzyRSlzKeKrVRyPjmPTxCf4rCUSuISLs53w8m3QNy8xMht7/ySc6nCeAOf+MWIS0qRnYJc5A1KK6hWoaDbtMWUdd6GcnJYkmCpzNI13RaAmXwLxNm9jsZkw1ohIxcehDQm3+rkLqjFJVU1asm2UKVXO+nBfr4V/a5ky7xm74H2sGTvFCTHFnS7R6fehhaH/1Xx+WiaxPZoVdNshOTkBbW4eWmnkNHskMUl+ZrF83WJMYpVqWfvse2hLO3w+O6Is7zRcd6GFicZqbIxYKtDus0/YKv5lmTNX5S4ZDI1n0qlvGUy5W8kvU9yPjU/721Kjncc70q9BeL8Lhef5rz/xz/X+Yu5VVHs9YlexAm+SPjE01Iv+rQI/5+InDcXfcFnRDR83lxIh3j2RMOhc4Z5zTOjmfNmRsRpUfpciXJTjb1vrzhumss4C9gzEcdxR1toWjPcqw/PkDgO+teKXlDEOerk+mX3z0UgiOAfj4qvNjc74tDSFR5fELy3/NwcelieXH7rG/5PvS28/+hu7XctktP//BtOI46efP2O9HRd+qsIIO5RHuELftRFHEKIC+EVxOJwC8RfrR94b+VtY1Ucvoe9EhqLk1g9YY+/By+8GhziWG/p7RrXR+MSN/mmqcRZWeBI4DGgAHiCiyYYXxteGr1OxNudLoxrR/zPqQggLnMbhdBKbhlqe9vzYVSJKeWHZbYyQJry2LzKo6qyneHrcYQW+qhXdNzDjTwai+PgZr/nLriwt50UdGxe68ophJztlCqvIlQpIn0OVpXVGtLjlS6aUpw8KgPnv1uZaKXvPjG1mlsVzf6eZWKZhlOtORWzcPDkMBNrqKZbOzztq0IBxBW3yqh1tb4Mq1lutM6u7KrCQ6lxn5c/LodHt3j9rhpuDvE920rk2etS43/62kcS54uDrc/5xt2s0FgOO/fZz2xUGbRuwfquUL1buCnBzWW2MZDvqtqXqv65O+78phC3/4ACDhwc1HtS3zJ1e8dhY0vZYnaxhhvfvl0Ro0r6SU7Qs4pe4w+mV/UyAcTl9fvsKF9fRkiLjZbZlTxCD3/c5RFWybV+KDSLiGt9U7gnNdxl9ie+sQ5RM++L21Der8HKOoQ3a5b4iG/m2U27dZXdGljipoR/7NxT/np/qWtZK3n928k4MmUfRwOKTkMqSqdpmQFhXKZpbwEiVNorRelCmqKBTJ/QAU5HAHEDdlN9xNeX2cqua2BxNQ493OhCrjdEISxuCw8U8v/ylfwC/7S6DBv4np2Iy4u4P6w8QPDreC6X4/X7rWWIxf19HpdU/btGuan+VFhaxqW+fh/N3qg6gGu3hxCLu2kzjS/G4qStdVa/VYD1W4XGOgvr96H+LMWOlCJqDI/FSd4AgMWh6zWG5XCHl6vhe54dDRgWcfCOwq8p63Bt2SvNpjgkf6UiB7e424qCxRWxuDLcHLLN28qPP/AyviVvCxx6Z4DqeBD1xK344v7uxSy4W8NjwscpZR0PBp/y+KZG8mZKwff9yjKUE3h0Xtht3+brQcRFIiAa8aIQ/z5E+It/XgFObk72jF4gnVocpwkcF+ZCYewGbwqc5u0Lc5wYwmUk4MBCE72AAu8L4ZJXXfMSjqOl4AUbooDF4B8RwlXGJS6Mf4bgjb6aiP8CgZtaHG3UWnsdsNXZH0b5KB9jgFaLhr1ejuXBomsUEFNg0gjIUYqh0wIInyoiCZA5cOM8ifM3uaPt4/JRAvbi/tDRjuODL1c5Wjw/dpRPTBOOHNqOSwMzFovJe1anIpmlmtkyskXLXOss7mUPqFwmVj2wXNdqW0bPlALoes7Z5KpvjinElbJAEHDcW7dNo5mleqZj1Qyz0F6zs//o4JjkABz2S4OW6HYqWr4ea9kBdD1nhsSdL0RcQIi4gEwvDvl99/NZDu5365c4TtaPmXLCbhpxDAMgRbMA5wglL5tfxD1eqXNcpWRNUnxtmkv+M6aP43pZPHZWM0cC4P/580KcvnyCEq7abr88Q4eT+TclDocjerxguNTiP8GSVOW1lhSWK52qgGRKswTwj46pMRZX4PhSlkvzSFblcABjE6YX93AXhlAT55Lj+SH4lPfWUPenmbzpIdwaJzNOIa4eD4+G40kkNJ5p8iea8CLk1/Ua5B8aZUBxrRwORxjTBIs7MUeyXDP9z8iT/VjHMR1DlEyg5wumXovFslmjarrFgxyuGpwA4nJl1Oo+ho6iqPKPzfLTQiMPR0qu6+2pteLQwUWhfbjdxy2zPmD15WpGsXvKHK/waKS2UVVR+j0JLti47kh5AEeH3T83N004ooIQAloBLPZ7pb5ZExezWafXMWMlaadkW2C/A7Ils1PviNUscPWOo4oBhB0RQJywzI6kx1BA9a78OY+eHnRhY8CudVu7PG5+Twt7Kfax/AGvP8ONr54ynva9zLXL1AejsvwMbrDbvLyhD1t3ivV8pUyvSFv5s2lx50sAcZ0FYZXdYEdzh10sAm7e5tFKn9O79e8RWpJG2fjIGsirUPbFda0wcgawt6sort5dy6ON0g+KkoSPe9m5kb2QxK1vy37FY4cZEnfd1h/V2I3SVQa3uGe4j6vu8pUB2xu3OFvfKNc3JPkxGovDKT3nZHDjZGQBKgrP7bJ3eFZAzRRspthRjdHgQv9yiBvZaI9HbdhbdTPyHMIFJ449GBmvj8sihO/EVR4fkONYXNX1OjqXQ4aSVHHTQ1wb4j6uhuoZ2MsjeU/B/Zx6RuIQl9YoGAK839PVKeC/6OZ1ZNbzis7k7bdSYZoL/yMB4rjJx38I429xk4I/qh4f9yO24/QdjR/BjKsfPZUJjUfVVz0gnEIcUynrmYJpMuNZkkpf/1425f6BKMeKmqkV+ppjUiDmiEI1K5ayjCXylhyOsbFAE00zlDm09uyeyxiuPBrPkjixmFZxOu/iSCRmLsZyxWxs3wa5Tj2Ss0RXPqipzk7REPVgsyQzJI7mQQHnDnSa93IIIJQ6QtWUC+GqHFO1GGW1OhrOIwScOFT76WyJifE63ZezTOevf/oJzJC48+W04v7i1Y8AFWdWnJ9KwSMdYV9I+ISWCF/KpCYVL7E4tFnmuNZVP93EaedjfyDVvx+Xx/Pn/lDa+qmd4seVvIXc9tPUcZ3J7rMWpwmLFiULQNDSVkdWAciBfb/nxxHI/vMhYN/tjzdOkeIHEaekIKrsIs1UkSjiHMIKy7GDAdRMQcZ7wpqAU0Hc1lpdZi0viqpsqprK4b2cbAqawFlcVcB1OdESXsfcNLlqRapncJLPVGp+WEKBrU6vX405vNl3eqppZnU83NawQ7PHxbL9al+OmTAvOmY9wCz69OJWR315TkGOtc0vxNXV+lDezjYHespShFXmptSQNoujPIfFsU1pIS4qWUVMsU11VVYsRRzKCb4ptC0FbWZeFfcGEafHOwYOR4o4LHHw2ogAsyI8MTNZ8LRj7pt2XSs2w33Ta3yx/bzgZC3DQm1T3ROdAJFcAHGtYUNSoJV7ai904GaXrQ+gPhhJqJ4fiZkHe4VVqOOkAd+qNXbB1ndzSnmFb7Or+rOcoradXLldX85tq8oJ78qdTlyEAlQERKkIjRfeByCYhlUBAlaQLboqAD6cLnCAKQAEqnypANMWFS5RshrkP6gGEMfiJFORV+kVW+HRarOsd9m1QaPGVsr1x3Yzzq7yvrguyyHFbi0zkK+3i3BVX2cQGiVlJa8PGSQrrzehOUODwx6qF+EeGsX37ByP4qwiVNqHRTRqP0ByClZqcI/XcYbayuBkClfotdu8vI0rwkp7DulxdkVFlXYc5i6bOC/ZnMzdjlPPo/cLETo+5g+YaPzFoReS2/HscGiS5V4ycecLEUfEEXE+QefjQi/MtT0HPZ9bC5ibzq44OYlQ0/ZGhtYDvFiT0DiX4rxOfydX9I54I0TMX/n7uSkfQs+ouKdSa0Mw3HDuoGiEd5qSk1NNvWaZhsuhDJNz3OpO1kSmqe3ETLnoCEateigQcSHZzRiGjbOnTGujX7HXYg/Y3I7pGhUvqsvl+kt2050zqrWdits2nIyBVwdS8Pt2lsT1Bj1rMBLdVjzTK4+keDXjxA23wmNxGZz/84eqoO/yO0ZfqK87D3plofdaWemsiwuJsqCFLSsshIUqXgtajJdVb/ZDDHGi90Yr582bcCIyVVnUBGSp2inG4hkSx4WOJ9kmy8kcHHf02urxrNvx5BsRR+K4I85c3BnFb7Mnjps8QQ6HJy/gT3xNQl/uteZ1L6E4Tu+yIwnHtLrEoZ7NHfVzPbc2DoTFSTx8qp5tFsW12kJTNdzDg0x25zDmumYldui6sGeaOedHo2a4Ri7jFPGicoogZBbF6THFMd2Mqc+JbsXs75hm27FdaAg4wHPVUdY8NKvDUTaeNU6RaM2guBCO33AYh0O5sFgVOW/D+3jdHQ7ZBC0kaFlOEJAoamdyr86OuOMoLnQcxIUmD1RfeGZ6yuhtJsWdL0QcEUfE+RBxASHiAkLEBYSICwgRFxAiLiBEXECIuIAQcQEh4gJCxAWEiAsIERcQIi4gRFxAiLiAEHEBIeICQsQFhIgLCBEXECIuIERcQIi4gBBxASHiAkLEBYSICwgRFxAiLiBEXECIuIAQcQEh4qbl519+9lZE3JT8eu3Xa9cAETctv1z7+ddfrv1CxE3Lb79dw/xKxE0Lbm3XqN9Ii5uea9dwm4sQcdPz8y+4vQEaTiWOfmt/a/k5x3F0eDpxby/nK44OzYw4AZ4niEOn+z1yBAKBQCAQCAQCgUAgEAgEAoFAOIl/AT7N1QAR3dCYAAAAAElFTkSuQmCC",
			mintDate: "1670058913420",
		},
		{
			title: "Moralis Hires Full Time Developers [NodeJS + Linux + Devops + RabbitMQ]",
			body: `We are going to 3-5x our team this year.
            We need senior developers.
            Join us on this quest!!
            
            Watch this video to apply:`,
			author: "Ivan",
			authorAvatar:
				"data:image/png;base64,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",
			mintDate: "1670058913420",
		},
		{
			title: "Moralis Hires Full Time Developers [NodeJS + Linux + Devops + RabbitMQ]",
			body: `We are going to 3-5x our team this year.
            We need senior developers.
            Join us on this quest!!
            
            Watch this video to apply:`,
			author: "Ivan",
			authorAvatar:
				"data:image/png;base64,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",
			mintDate: "1670058913420",
		},
	];

	// const cards = proposals.map((item,idx)=>{
	//     return (
	//         <HubCard key={"s"+idx} item={item}/>
	//     );
	//     if(idx === 0)
	//         return <HubCard key={"s"+idx} item={item}/>
	//     return (
	//         <div className="flex">

	//         </div>
	//     );
	//     // if(idx === 0){
	//     //     return (
	//     //         <div key={"s"+idx} className="flex flex-col w-full p-16 rounded-xl">
	//     //             <h1 className="text-5xl font-semibold max-w-[79%]">{item.title}</h1>
	//     //             <p className="text-xl font-medium font-primary">{item.body}</p>
	//     //             {item.videoUrl && <p className="text-xl font-medium font-primary mt-7">Watch this video to know more: {item.videoUrl}</p>}
	//     //             <hr/>
	//     //             <div className="flex items-center justify-between w-full">
	//     //                 <div className="flex items-center space-x-5">
	//     //                     <div className="rounded-full w-[84px] h-[84px] relative overflow-hidden">
	//     //                         <Image alt="author" src={item.authorAvatar} objectFit="contain" priority/>
	//     //                     </div>
	//     //                     <div className="flex flex-col">
	//     //                         <p className="text-xl font-medium font-primary">Posted by- {item.author}</p>
	//     //                         <p className="text-xs font-medium font-primary">Posted 8 Days ago</p>
	//     //                     </div>
	//     //                 </div>
	//     //                 <div className="flex flex-col">
	//     //                     <button className="w-[60px] h-[60px] flex items-center justify-center bg-white text-black"><span class="material-symbols-outlined">bookmark</span></button>
	//     //                     <p>Bookmark</p>
	//     //                 </div>
	//     //             </div>
	//     //         </div>
	//     //     );
	//     // }

	//     return (
	//         <div key={"s"+idx}>

	//         </div>
	//     );
	// })

	const cards = [];
	for (let i = 0; i < proposals.length; i++) {
		if (i === 0) {
			cards.push(<HubCard item={proposals[i]} />);
		} else {
			cards.push(
				<div className="flex space-x-10">
					<HubCard item={proposals[i]} />
					{i + 1 < proposals.length && <HubCard item={proposals[++i]} />}
				</div>
			);
		}
	}
	return (
		<div className="flex items-center justify-center w-screen pt-20 bg-white">
			<div className="w-full max-w-[1920px] px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-36 mb-7">
				<h1 className="font-primary font-semibold text-[64px] pl-8">What&apos;s on your mind?</h1>
				<div className="mt-16">{cards}</div>
			</div>
		</div>
	);
}
