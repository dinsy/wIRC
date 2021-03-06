enyo.kind({
	name: 'wirc.Nick',
	kind: enyo.Control,
	
	//setup = {name: ''}
	
	setup: {},
	channels: {},
	channelModes: {},
	_cache: '',
	
	constructor: function(setup) {
	    this.inherited(arguments);
		//this.log(setup);
		this.setup = setup;
		this._cache = '';
	},
	
	setupItem: function(item) {
		this.generateCache();
		this.log(item, this._cache);
		
	},
	
	updateNick: function(nn) {
		this.setup.name = nn;
	},
	
	generateCache: function() {
		if (this._cache == '') {
			this._cache = {
				classes:	['message-row', this.setup.type],
				rowStyle:	{},
				chan:		(this.setup.chan ? '<#' + this.setup.chan + '>' : ''),
				nick:		(this.setup.nick || ''),
				nickStyle:	{},
				text:		(this.setup.text || ''),
				textCopy:	'',
				textStyle:	{},
			};
			
			switch(this.setup.type) {
				
				case 'status':
					this._cache.classes.push('no-sep');
					break;
					
				case 'notice':
					if (!this._cache.nick) this._cache.classes.push('no-sep');
					break;
				
				case 'action':
					this._cache.classes.push('no-sep');
					this._cache.nick = '*&nbsp;';
					this._cache.text = this.setup.nick + ' ' + this.setup.text;
					break;
				
				case 'privmsg':
					if (this.setup.self) this._cache.classes.push('self');
					// else if (random) get the nicks color and set it with nickStyle like below
					//	this._cache.nickStyle['color'] = enyo.application.p.get('colorOtherNicks');
					break;
				
				default:
					break;
			}
		}
	},

	addChannel: function(channel, mode) {
		if (channel) {
			if (!this.channels[channel.setup.name] || !channel.containsNick(this)) {
				if (!channel.containsNick(this))
					channel.addNick(this);
				if(!this.channels[channel.setup.name])
					this.channels[channel.setup.name] = channel;
				if (mode) this.channelModes[channel.setup.name] = [mode];
				else this.channelModes[channel.setup.name] = [];
			}
		}
	},

	removeChannel: function(channel) {
		if (channel) {
			channel.removeNick(this);
			delete this.channels[channel.setup.name];
			this.channelModes[channel.setup.name] = null;
		}
	},

	getHighestMode: function(channel) {
		if (this.channelModes[channel.setup.name].length < 1)
			return '';
		if (this.channelModes[channel.setup.name].length > 1)
			this.channelModes[channel.setup.name].sort(function(a, b) {
				return wirc.Nick.getModeNum(a) - wirc.Nick.getModeNum(b);
			});
		return this.channelModes[channel.name][0];
	},

	getListObject: function(channel) {
		var objMode = this.getHighestMode(channel);
		var obj = {
			name:	this.name,
			prefix:	(channel.setup.name ? wirc.Nick.getModePrefix(objMode) : ''),
			mode:	(channel.setup.name ? objMode : '')
		};
		return obj;
	},
	
	
    statics: {
		
		hasPrefix: function(nick) {
			if (wirc.Nick.getPrefixMode(nick.substr(0, 1)) != '') return true;
			return false;
		},
		
		getPrefixMode: function(prefix) {
			switch(prefix) {
				case '!':	return '!';
				case '.':	return 'u';
				case '@':	return 'o';
				case '%':	return 'h';
				case '+':	return 'v';
				default:	return '';
			}
		},
		
		getModePrefix: function(mode) {
			switch(mode) {
				case '!':	return '!';
				case 'u':	return '.';
				case 'O':	return '@';
				case 'o':	return '@';
				case 'h':	return '%';
				case 'v':	return '+';
				default:	return '';
			}
		},
		
		getModeNum: function(mode) {
			switch(mode) {
				case '!':	return 1;
				case 'u':	return 2;
				case 'O':	return 3;
				case 'o':	return 4;
				case 'h':	return 5;
				case 'v':	return 6;
				default:	return 7;
			}
		},
		
		sortByName: function(a,b) {
			if (a > b)
				return 1;
			else if (a < b)
				return -1;
			else
				return 0;
		},
			
		sortByMode: function(a,b) {
			if (wirc.Nick.getModeNum(a.mode) < wirc.Nick.getModeNum(b.mode))
				return -1;
			if (wirc.Nick.getModeNum(a.mode) > wirc.Nick.getModeNum(b.mode))
				return 1;
			else
				return wirc.Nick.sortByName(a.name.toLowerCase(),b.name.toLowerCase())
		},
    },
	
});
