"use strict";

// es5 polyfills, powered by es5-shim
require("es5-shim")
// es6 polyfills, powered by babel
require("babel/register")

var Promise = require('es6-promise').Promise


var Backbone = require('backbone')
var React = require('react')

var apikey = `c1e08233049fb45bea793e4c0e7e4b27`
var secret = `ff73e90235bd4bd416f27ebd9db2f3fb`
var qs = (s, d) => (d || document).querySelector(s)

var SoundcloudCollection = Backbone.Collection.extend({
	url: (apikey) => `https://api.soundcloud.com/tracks?client_id=${apikey}`
})


class SoundcloudItem extends React.Component {
	constructor(props)
	super(props)
	this.props.item

	render(){
		return (<li>this.props.item.get('name') - {this.props.time.toTimeString()}</li>)
	}
}

class SoundcloudView extends React.Component {
	constructor(props) {
		super(props)
		this.props.items.on('sync', this.forceUpdate.bind(this) )
		this.state = {
			time: new Date()
		}

		setInterval(() => {
			this.setState({ time: new Date() })
		}, 1000)

	}

	render(){
		return (
			var url = this.props.item.get('permalink_url')
				artwork_url = this.props.item.get('artwork_url')
				img = artwork_url ? (<img src={}>)

				<h1>{this.props.title} - <span>{this.state.toTimeString()}</span></h1>
				<ul>
					{this.props.items.map((i) => <SoundcloudItem key={i.id} item={i}  
						time={}/>)}
				</ul>
			</div>
		)
	}

}

var collection = new SoundcloudCollection()
collection.fetch().then(() => {
	React.render(<SoundcloudView name = "hannah" items={[]}/>, qs('.container') )
	})




































