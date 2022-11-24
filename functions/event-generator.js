// Static Event Generator
// Uses hours data (from data-samples\hours.js) to generate static events
// Also uses moment.js to format the time

// This function returns the time in the format HH:MM
// If difference is set to a number, the function will add or subtract the time
// The units parameter can be set to hours, minutes, or seconds
// The following line of code returns the time in the format HH:MM
function getTime(time, difference = false, units = "minutes") {
	if (difference) {
		if (difference < 0) {
			return moment(time).subtract(Math.abs(difference), units).format("HH:mm");
		}
		if (difference > 0) {
			return moment(time).add(difference, units).format("HH:mm");
		}
	} else {
		return moment(time).format("HH:mm");
	}
}

// Check if the market is open today
if (hours.today.isOpen) {
	// If the market is open, check for an early close and generate message to be added to market open event
	if (getTime(hours.today.sessionHours.regularMarket[0].end) !== "16:00") {
		var closeMessage = `**The market closes early today at ${moment(
			hours.today.sessionHours.regularMarket[0].end
		).format("LT")}.** `;
	} else {
		var closeMessage = "";
	}
	// Generate static events for the day
    // "preMarket start" requires a large adjustment because it's not when the exchange opens
    // but is instead when TD trading opens
	msg.payload = [
		{
			type: "static",
			time: getTime(hours.today.sessionHours.preMarket[0].start, -185),
			event: "Pre Market opens in **5 MINUTES**",
			sent: false,
		},
		{
			type: "static",
			time: getTime(hours.today.sessionHours.preMarket[0].start, -180),
			event: "Pre Market is now **OPEN**",
			sent: false,
		},
		{
			type: "static",
			time: getTime(hours.today.sessionHours.regularMarket[0].start, -5),
			event: "Market opens in **5 MINUTES**.",
			sent: false,
		},
		{
			type: "static",
			time: getTime(hours.today.sessionHours.regularMarket[0].start, -1),
			event: "Market opens in **1 MINUTE**",
			sent: false,
		},
		{
			type: "static",
			time: getTime(hours.today.sessionHours.regularMarket[0].start),
			event: `Market is now **OPEN** ${closeMessage}- Keep discussion topics trading related and refrain from posting GIFs.`,
			sent: false,
		},
		{
			type: "static",
			time: getTime(hours.today.sessionHours.regularMarket[0].end, -5),
			event: "Market closes in **5 MINUTES**",
			sent: false,
		},
		{
			type: "static",
			time: getTime(hours.today.sessionHours.regularMarket[0].end, -1),
			event: "Market closes in **1 MINUTE**",
			sent: false,
		},
		{
			type: "static",
			time: getTime(hours.today.sessionHours.regularMarket[0].end),
			event:
				"Market is now **CLOSED** - Off topic discussion and GIFs are now permitted, adult topics are restricted until 'Valhalla After Dark' at 6pm EST.",
			sent: false,
		},
		{
			type: "static",
			time: getTime(hours.today.sessionHours.regularMarket[0].end, 10),
			event: "Extended Options close in **5 MINUTES**",
			sent: false,
		},
		{
			type: "static",
			time: getTime(hours.today.sessionHours.regularMarket[0].end, 14),
			event: "Extended Options close in **1 MINUTE**",
			sent: false,
		},
		{
			type: "static",
			time: getTime(hours.today.sessionHours.regularMarket[0].end, 15),
			event: "Extended Options are now **CLOSED**",
			sent: false,
		},
		{
			type: "static",
			time: getTime(hours.today.sessionHours.postMarket[0].end, -5),
			event: "After Hours closes in **5 MINUTES**",
			sent: false,
		},
		{
			type: "static",
			time: getTime(hours.today.sessionHours.postMarket[0].end),
			event: "After Hours is now **CLOSED**",
			sent: false,
		},
		{
			type: "strategy",
			time: "11:15",
			title: "London Stock Exchange EOD",
			event:
				"**London Stock Exchange will close in 15 minutes.** The closing of the LSE can cause volatility in US markets.",
			sent: false,
		},
		{
			type: "strategy",
			time: "11:30",
			title: "London Stock Exchange EOD",
			event:
				"**London Stock Exchange is now closed.** Recent volatility could potentially be due to this.",
			sent: false,
		},
		{
			type: "strategy",
			time: getTime(hours.today.sessionHours.regularMarket[0].end, -150),
			title: "Theta Decay",
			event:
				"**Theta decay is now accelerating.** Soonest expiring options will begin to lose value to theta at an increased rate of speed from now until close.",
			sent: false,
		},
		{
			type: "strategy",
			time: getTime(hours.today.sessionHours.regularMarket[0].end, 120),
			title: "Valhalla After Dark",
			event:
				"After Hours rules are now in effect so **anything goes**. Images with nudity require the 'spoiler' tag which you can read on how to use here: https://support.discord.com/hc/en-us/articles/360022320632-Spoiler-Tags",
			sent: false,
		},
	];
} else {
	// If the market is closed, generate static events for the day
	msg.payload = [
		{
			type: "static",
			time: "09:00",
			event:
				"**The market is closed today.** After Hours rules are now in effect so **anything goes**. Images with nudity require the 'spoiler' tag which you can read on how to use here: https://support.discord.com/hc/en-us/articles/360022320632-Spoiler-Tags",
			sent: false,
		},
	];
}

// mcal is the variable that stores the economic calendar events
// Get starting timestamp for the day
var now = new Date();
var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
var today = startOfDay.getTime() / 1000;
msg.today = today;

// Loop through the calendar and add events to the payload
mcal.forEach((date) => {
	// If the event is today, add it to the payload
	// These used to power the "Market Alerts" for data drops
	// However they're now just used by the system to know how many items to look for
	// when the drop times come up.
	var eventDate = new Date(date.date);
	var startOfDay = new Date(
		eventDate.getFullYear(),
		eventDate.getMonth(),
		eventDate.getDate()
	);
	var eventTimestamp = startOfDay.getTime() / 1000;

	if (eventTimestamp == today) {
		date.events.forEach((event) => {
			event = {
				type: "mcal",
				time: event.time,
				event: event.name,
				date: date.date,
				sent: false,
			};
			msg.payload.push(event);

			// This is the first "strategy" event, these are added if FOMC Minutes are detected in the market calendar
			// Eventually strategy events will be capable of triggering advanced processes in the system, for instance
			// in thee cases of FOMC Minutes, triggering a process that attempts to call a better exit on that play
			if (event.event.includes("FOMC Minutes")) {
				event = {
					type: "strategy",
					time: "09:15",
					title: "FOMC Minutes Drop Strategy",
					event:
						"**FOMC Minutes will be released today at 2PM EST.** You can read about the FOMC minutes strategy here: <https://forums.ascendedtrading.com/t/fomc-minutes-drop/13714>",
					sent: false,
				};
				msg.payload.push(event);
				event = {
					type: "strategy",
					time: "13:00",
					title: "FOMC Minutes Drop Strategy",
					event:
						"**FOMC Minutes will be released in 1 hour.** If you're running strangles now is the suggested time to start acquiring your position. You can read about the FOMC minutes strategy here: <https://forums.ascendedtrading.com/t/fomc-minutes-drop/13714>",
					sent: false,
				};
				msg.payload.push(event);
				event = {
					type: "strategy",
					time: "13:45",
					title: "FOMC Minutes Drop Strategy",
					event:
						"**FOMC Minutes will be released in 15 minutes.** Now is the time that it is *usually* best to start taking your position. You can read about the FOMC minutes strategy here: <https://forums.ascendedtrading.com/t/fomc-minutes-drop/13714>",
					sent: false,
				};
				msg.payload.push(event);
				event = {
					type: "strategy",
					time: "13:59",
					title: "FOMC Minutes Drop Strategy",
					event:
						"**FOMC Minutes will be released in 1 minute.** Once released there is *usually* a pop upward that lasts for roughly 2 minutes. You **must** cut if you are green because the price action often reverses strongly in the opposite direction.",
					sent: false,
				};
				msg.payload.push(event);
				event = {
					type: "strategy",
					time: "14:02",
					title: "FOMC Minutes Drop Strategy",
					event:
						"**This is the average point where we've cut positions historically, if you're green consider exiting your position.**",
					sent: false,
				};
				msg.payload.push(event);
			}
		});
	}
});

return msg;
