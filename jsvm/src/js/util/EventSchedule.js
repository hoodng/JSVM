/**
* make object-oriented 2 stream-oriented
* target is js.util.EventTarget's instance
* shareStreamData sould be jsvm's object's this.
*/
$package("js.util");
js.util.EventSchedule=function(){
	var NS=arguments.callee;if(NS.__defined__){if(this instanceof NS){this.initialize.apply(this,arguments);}else{if(NS.$){return NS.$.
	apply(this,arguments);}else{throw new Error();}}return;}NS["#"]="js.util.EventSchedule";NS.__defined__=true;
	//--------------------------------------------------Start the CLASS definition --------------------------------------------------------

	var EventScheduleGeneric=js.lang.Class.forName("jrs.script.schedule.Generic");
	var E=NS.E=EventScheduleGeneric.E;
	var O=NS.O=EventScheduleGeneric.O;

	var EventRegisterA=function(target,eventName,callback,shareStreamData){
		target.attachEvent(eventName,1,shareStreamData,callback);
	};
	var EventRescindA=function(target,eventName,callback,shareStreamData){
		target.detachEvent(eventName,1,shareStreamData,callback);
	};
	var instanceA=EventScheduleGeneric.Create(EventRegisterA,EventRescindA);
	/**
	* EventStream.Fasten(target,eventName,nonDisposable,shareStreamData);
	*/
	NS.FastenA=instanceA[EventScheduleGeneric.Fasten];
	/**
	* EventStream.Lift(target,eventName,_stream);
	* _stream is [option] if it is pure stream function
	*/
	NS.LiftA=instanceA[EventScheduleGeneric.Lift];

//-----------------------------------------------------------------------
	var EventRegisterB=function(target,eventName,callback,shareStreamData){
		target.attachEvent(eventName,4,shareStreamData,callback);
	};
	var EventRescindB=function(target,eventName,callback,shareStreamData){
		target.detachEvent(eventName,4,shareStreamData,callback);
	};
	var instanceB=EventScheduleGeneric.Create(EventRegisterB,EventRescindB);
	NS.FastenB=instanceB[EventScheduleGeneric.Fasten];
	NS.LiftB=instanceB[EventScheduleGeneric.Lift];

//-----------------------------------------------------------------------

	var EventUtil=js.lang.Class.forName("jrs.browser.Event");
	var instanceC=EventScheduleGeneric.Create(EventUtil.AddListener,EventUtil.RemoveListener);
	NS.FastenC=instanceC[EventScheduleGeneric.Fasten];
	NS.LiftC=instanceC[EventScheduleGeneric.Lift];

	//--------------------------------------------------The end of the CLASS definition--------------------------------------------------------
	return NS;
}();
