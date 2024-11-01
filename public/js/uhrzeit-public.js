Date.prototype.addHours = function (h) {
	this.setTime(this.getTime() + (h * 60 * 60 * 1000));
	return this;
};

Date.prototype.addMin = function (h) {
	this.setMinutes(this.getMinutes() + h);
	return this;
};

(function ($) {
	'use strict';
	$(function () {
		String.prototype.capitalize = function () {
			return this.charAt(0).toUpperCase() + this.slice(1)
		};

		var timeWidgets = $(".time-widget");
		for (var i = 0; i < timeWidgets.length; i++) {
			var timeWidget = timeWidgets[i];
			if (timeWidget) {
				var city = timeWidget.getAttribute("data-city");
				var country = timeWidget.getAttribute("data-country");
				var language = timeWidget.getAttribute("data-language") || "german";
				var location_for_rest = city.replace(" ", "_") + "," + country;
				loadXMLDoc(timeWidget, city, country, language, location_for_rest);
			}
		}

		function loadXMLDoc(timeWidget, city, country, language, location_for_rest) {
			var xhr = new XMLHttpRequest();
			xhr.onload = function () {
				// Process our return data
				if (xhr.status >= 200 && xhr.status < 300) {
					// Runs when the request is successful
					handleResponse(JSON.parse(xhr.responseText), timeWidget, city, country, language);
				} else {
					// Runs when it's not
					console.log(xhr.responseText);
				}
			};
			xhr.open('GET', 'https://www.uhrzeitde.com/rests/publicTimeForLocation.php?city=' + city + '&country=' + country + '&place=' + location_for_rest + '&domain=' + document.location + '&language=' + language);
			xhr.send();
		}


		function handleResponse(response, timeWidget, city, country, language) {
			var utcOffset = response.data.time_zone[0].utcOffset;

			var isAnalog = timeWidget.getAttribute("data-analog");
			var isDigital = timeWidget.getAttribute("data-digital");
			var isDate = timeWidget.getAttribute("data-date");
			var widgetInputWidth = timeWidget.getAttribute("data-width");
			var backgroundColor = timeWidget.getAttribute("data-background");
			if (!backgroundColor || backgroundColor === '' || backgroundColor === '#becffb') {
				backgroundColor = 'linear-gradient(to left, #d3dfff, #fbfcff)';
			}
			var textColor = timeWidget.getAttribute("data-text-color");
			if (!textColor || textColor === '') {
				textColor = 'black';
			}

			var deepLink = response.deepLink;
			var title = city.capitalize() + " Uhrzeit";
			if (language === "english") {
				title = "Time in " + city.capitalize();
			}

			// set tight if user asked for not 100%
			if (widgetInputWidth === 'tight') {
				$(timeWidget).addClass('tight');
			} else {
				$(timeWidget).addClass('maxwidth');
			}

			// get widget width
			var widgetWidth = $(timeWidget).width();
			var widthClass = "regular";
			if (widgetWidth < 200) {
				widthClass = "super-small";
			} else if (widgetWidth < 300) {
				widthClass = "small";
			}


			// wrap deep link
			var mainDeepLinkElm = document.createElement("a");
			mainDeepLinkElm.setAttribute("href", deepLink);

			//mainWrapElm
			var mainWrapElm = document.createElement("div");
			mainWrapElm.setAttribute("class", 'main_wrap ' + widthClass);
			mainWrapElm.setAttribute("style", "background: " + backgroundColor + " ;color:" + textColor);

			//title
			var titleElm = document.createElement("div");
			titleElm.innerHTML = title;
			titleElm.setAttribute("class", "time_title");
			mainWrapElm.appendChild(titleElm);


			// data wrap
			var dataWrapElm = document.createElement("div");
			dataWrapElm.setAttribute("class", "data-wrap");


			if (isAnalog === "on") {
				var analogElm = document.createElement("div");
				var canvasElm = document.createElement("canvas");
				canvasElm.setAttribute("width", "180");
				canvasElm.setAttribute("height", "180");
				canvasElm.setAttribute("class", "analog-clock-canvas");
				analogElm.appendChild(canvasElm);
				analogElm.setAttribute("class", "analog-clock-wrap");
				dataWrapElm.appendChild(analogElm);
				var ctx = canvasElm.getContext("2d");
				var radius = canvasElm.height / 2;
				ctx.translate(radius, radius);
				var innerRadius = radius * 0.90;

			}


			if (isDigital === "on") {
				var digitalElm = document.createElement("div");
				var hourElm = document.createElement("div");
				hourElm.setAttribute("id", "hour");
				var minuteElm = document.createElement("div");
				minuteElm.setAttribute("id", "min");
				var secElm = document.createElement("div");
				secElm.setAttribute("id", "sec");
				var colonsElm = document.createElement("div");
				colonsElm.setAttribute("class", "time_colons");
				colonsElm.innerHTML = ":";
				var colonsElm2 = document.createElement("div");
				colonsElm2.setAttribute("class", "time_colons");
				colonsElm2.innerHTML = ":";
				digitalElm.appendChild(hourElm);
				digitalElm.appendChild(colonsElm);
				digitalElm.appendChild(minuteElm);
				digitalElm.appendChild(colonsElm2);
				digitalElm.appendChild(secElm);
				digitalElm.setAttribute("class", "digital-clock-wrap");
				dataWrapElm.appendChild(digitalElm);
			}

			if (isAnalog === "on" || isDigital === "on") {
				setInterval(function () {
					drawClock(ctx, innerRadius, utcOffset, isDigital, isAnalog);
				}, 1000);
			}

			if (isDate === "on") {
				var formattedDate = getFormattedDate(response.data, language);
				var dateElm = document.createElement("div");
				dateElm.innerHTML = formattedDate;
				dateElm.setAttribute("class", "date_title");
				dataWrapElm.appendChild(dateElm);
			}

			mainWrapElm.appendChild(dataWrapElm);
			mainDeepLinkElm.prepend(mainWrapElm);
			timeWidget.prepend(mainDeepLinkElm);
		}
	});


	function getFormattedDate(data, language) {
		var monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
		var dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
		if (language === "english") {
			var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		}
		var date = data.time_zone[0].localtime,
			utcOffset = data.time_zone[0].utcOffset;
		var year = date.substring(0, 4);
		var month = date.substring(5, 7);
		var day = date.substring(8, 10);
		var hour = date.substring(11, 13);
		var minute = date.substring(14, 16);
		//set date
		var dayInt = day % 7;
		var newDate = new Date(year, Number(month) - 1, Number(day), hour, minute, '0', '0');
		// Extract the current date from Date object
		newDate.setDate(newDate.getDate());
		var d = new Date(date);
		// Output the day, date, month and year

		var formattedTime = dayNames[newDate.getDay()] + " " + day + ' ' + monthNames[Number(month - 1)] + ' ' + year;
		return formattedTime;
	}

	function drawClock(ctx, innerRadius, utcOffset, isDigital, isAnalog) {
		if (isAnalog === "on") {
			drawFace(ctx, innerRadius);
			drawNumbers(ctx, innerRadius);
		}
		drawTime(ctx, innerRadius, utcOffset, isDigital, isAnalog);
	}

	function drawFace(ctx, radius) {
		var grad;
		ctx.beginPath();
		ctx.arc(0, 0, radius, 0, 2 * Math.PI);
		ctx.fillStyle = 'white';
		ctx.fill();
		grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
		grad.addColorStop(0, '#262261');
		grad.addColorStop(0.5, 'white');
		grad.addColorStop(1, '#262261');
		ctx.strokeStyle = grad;
		ctx.lineWidth = radius * 0.1;
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
		ctx.fillStyle = '#333';
		ctx.fill();
	}

	function drawNumbers(ctx, radius) {
		var ang, num;
		for (num = 1; num < 61; num++) {
			ang = num * Math.PI / 30;
			ctx.strokeStyle = 'gray';
			ctx.lineWidth = 2;
			ctx.lineCap = "round";
			ctx.rotate(ang);
			ctx.translate(0, -radius * 0.95);
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(0, 4);
			ctx.stroke();
			ctx.translate(0, radius * 0.95);
			ctx.rotate(-ang);
		}
		ctx.font = radius * 0.15 + "px arial";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		for (num = 1; num < 13; num++) {
			ang = num * Math.PI / 6;
			ctx.rotate(ang);
			ctx.translate(0, -radius * 0.75);
			ctx.rotate(-ang);
			ctx.fillText(num.toString(), 0, 0);
			ctx.rotate(ang);
			ctx.translate(0, radius * 0.75);
			ctx.rotate(-ang);
			//thick
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 3;
			ctx.lineCap = "round";
			ctx.rotate(ang);
			ctx.translate(0, -radius * 0.95);
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(0, 8);
			ctx.stroke();
			ctx.translate(0, radius * 0.95);
			ctx.rotate(-ang);
		}
	}

	function drawTime(ctx, radius, utcOffset, isDigital, isAnalog) {
		var offset = new Date().getTimezoneOffset() + 60 * Number(utcOffset);
		var now = new Date().addMin(offset);
		var hour = now.getHours();
		var minute = now.getMinutes();
		var second = now.getSeconds();

		var dis_hour = hour;
		if (dis_hour < 10) {
			dis_hour = "0" + hour;
		}

		var dis_min = minute;
		if (dis_min < 10) {
			dis_min = "0" + minute;
		}

		var dis_second = second;
		if (second < 10) {
			dis_second = "0" + second;
		}

		if (isAnalog === 'on') {
			//hour
			hour = hour % 12;
			hour = (hour * Math.PI / 6) +
				(minute * Math.PI / (6 * 60)) +
				(second * Math.PI / (360 * 60));
			drawHand(ctx, hour, radius * 0.5, radius * 0.07);
			//minute
			minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
			drawHand(ctx, minute, radius * 0.8, radius * 0.07);
			// second
			second = (second * Math.PI / 30);
			drawHand(ctx, second, radius * 0.9, radius * 0.02, '#ff0000');
		}

		if (isDigital === 'on') {
			$('#hour').html(dis_hour);
			$('#hour_string').html(dis_hour);
			$('#min').html(dis_min);
			$('#min_string').html(dis_min);
			$('#sec').html(dis_second);
			$('#sec_string').html(dis_second);
		}
	}

	function drawHand(ctx, pos, length, width, color) {
		if (!color) {
			color = 'black';
		}
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		ctx.lineCap = "round";
		ctx.moveTo(0, 0);
		ctx.rotate(pos);
		ctx.lineTo(0, -length);
		ctx.stroke();
		ctx.rotate(-pos);
	}
})(jQuery);
