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
        this.state = {
            track: this.props.item.id,
            playing: false
        }
    }
    toggleSong() {
        if (this.state.playing) {
            this.state.song.pause()
        } else {
            if(this.state.song){
                this.state.song.play()
            } else {
                SC.stream(`/tracks/${this.state.track}`, (sound) => {
                    this.setState({song: sound})
                    sound.play()
                })
            }
        }
        this.setState({ playing: !this.state.playing})
    }
    render() {
        console.log(this.props)
        var artwork_url = this.props.item.attributes.artwork_url,
            title = this.props.item.attributes.title

        return (<div className="player">
           			 <div className="top">
                		<div id="image" onClick={() => this.toggleSong()}><img src={artwork_url}/></div>
                		<div id="controls"><h6>{title}</h6></div>
                		<div id="song_length"></div>
            		</div>
            		<div className="bottom"></div>
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
        </div>)
    }
}

React.render(<Header/>, qs('.header'))