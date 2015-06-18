"use strict";
require("es5-shim")
require("babel/register")
var Promise = require('es6-promise').Promise
var $ = require('jquery')
var _ = require('underscore')
var Backbone = require('backbone')
var React = require('react')

//essential informations
var apikey = `c1e08233049fb45bea793e4c0e7e4b27`
var secret = `ff73e90235bd4bd416f27ebd9db2f3fb`
var qs = (s, d) => (d || document).querySelector(s)

// Runs the SC obj from sdk-2.0.0 and authenticates our credentials with SoundCloud
SC.initialize({
    client_id: apikey,
})

// Each track's information represented with model
var SoundcloudModel = Backbone.Model.extend({
    idAttribute: 'id',
    url: function() {
        return `https://api.soundcloud.com/tracks/${this.id}?client_id=${apikey}`
    }
})

// A query search of tracks represented by collection
window.SoundSearchCollection = Backbone.Collection.extend({
    initialize: function() {
        this.on('sync', console.log(this))
    },
    url: function() {
        return `https://api.soundcloud.com/tracks.json?client_id=${apikey}&q=${this.query}`
    }
})

//view template of one search item
class ListItem extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        var artwork_url = this.props.item.attributes.artwork_url,
            title = this.props.item.attributes.title,
            likes = this.props.item.attributes.likes_count,
            played = this.props.item.attributes.playback_count

        return (<div className="player">
                        <div className="top">
                        <div id="image"><img src={artwork_url}/></div>
                        <div id="controls">     
                        	<img src="./images/volume51.png"/>
                			<img src="./images/volume49.png"/>
                			<img src="./images/volume47.png"/>
                			<h6>{title}</h6>
                        </div>
                        <div id="song_length"></div>
                    </div>
                    <div className="bottom">
                    	<img id="logo" src="./images/online36.png"/>
                    	<p>BUY</p>
                		<img src="./images/play107.png"/>
                		<h6>{played}</h6>
                		<img src="./images/favorite21.png"/>
                		<h6>{likes}</h6>
                    </div>
                </div>)
    }
}

//view template of search list
class ListView extends React.Component {
    constructor(props) {
        super(props)
        this.props.items.on('sync', () => this.forceUpdate())
    }
    render() {
        var models = this.props.items.query ? this.props.items.models : []
        return (<div className='searchList'>
                    {models.map((x) => <ListItem key={x.id} item={x}/>)}
                </div>
                    )}
}
//Header contains 
class Header extends React.Component {
    constructor(props) {
        super(props)
        this.search = this.getSearcher()
    }
    getSearcher() {
        var searchColl = new SoundSearchCollection 
        React.render(<ListView title='searchResults' items ={searchColl}/>, qs('.results'))
        var search = function (e) {
            e.preventDefault()
            var input = React.findDOMNode(this.refs.searchBox)
            searchColl.query = input.value
            searchColl.fetch()
        }
        return search
    }
    render() {
        return (<div>
        	<div className="header">
            <div className="logo">
                <img src="./images/logo.png" />
            </div>
            <div id="home">
                <p>Home</p>
            </div>
            <div id="collection">
                <p>Collection</p>
            </div>
            <div></div>
            <form onChange={(e) => this.search(e)} onSubmit={(e) => e.preventDefault()}>
                <input type="text" ref='searchBox'/>
            </form>
            </div>
        </div>)
    }
}

React.render(<Header/>, qs('.header'))

///test cases for future functionality
// window.songs = []
// var renderSong = (id) => {
    // SC.stream(`/tracks/${id}`, function(sound) {
        // window.songs.push(sound)
    // })
// }


// search('beatles')