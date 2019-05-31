import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	ViewChild
} from '@angular/core';
import { CKEditor5 } from '@ckeditor/ckeditor5-angular/ckeditor';
import * as ClassicEditorBuild from '../../../vendor/ckeditor5/build/classic-editor-with-real-time-collaboration.js';
import { CloudServicesConfig } from './common-interfaces';

@Component( {
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: [ './editor.component.css' ]
} )
export class EditorComponent implements AfterViewInit {
	@ViewChild( 'sidebar' ) private sidebarContainer?: ElementRef<HTMLDivElement>;
	@ViewChild( 'presenceList' ) private presenceListContainer?: ElementRef<HTMLDivElement>;

	public Editor = ClassicEditorBuild;
	public editor?: CKEditor5.Editor;

	public ready = new EventEmitter<CKEditor5.Editor>();

	// The application data should be loaded from the backend and saved to it after each editor change.
	// This way the content on the backend will be in sync with the editor content.
	public appData = {
		// User data.
		users: [
			{
				id: 'user-1',
				name: 'Joe Doe',
				// Note that the avatar is optional.
				avatar: 'https://randomuser.me/api/portraits/thumb/men/26.jpg'
			},
			{
				id: 'user-2',
				name: 'Ella Harper',
				avatar: 'https://randomuser.me/api/portraits/thumb/women/65.jpg'
			}
		],

		// The ID of the current user.
		userId: 'user-1',

		// Suggestion data.
		suggestions: [
			{
				id: 'suggestion-1',
				type: 'insertion',
				authorId: 'user-2',
				createdAt: new Date( 2019, 1, 13, 11, 20, 48 )
			},
			{
				id: 'suggestion-2',
				type: 'deletion',
				authorId: 'user-1',
				createdAt: new Date( 2019, 1, 14, 12, 7, 20 )
			}
		],

		// Editor initial data.
		initialData:
			`<h2>
				 Bilingual Personality Disorder
			 </h2>
			 <p>
				 This may be the first time you hear about this
				 <suggestion id="suggestion-1:user-2" suggestion-type="insertion" type="start"></suggestion>
				 made-up<suggestion id="suggestion-1:user-2" suggestion-type="insertion" type="end"></suggestion>
				 disorder but it actually isn’t so far from the truth.
				 As recent studies show, the language you speak has more effects on you then you realise.
				 According to the studies, the language a person speaks affects their cognition,
				 <suggestion id="suggestion-2:user-1" suggestion-type="deletion" type="start"></suggestion>
				 feelings, <suggestion id="suggestion-2:user-1" suggestion-type="deletion" type="end"></suggestion>
				 behaviour, emotions and hence <strong>their personality</strong>.
			 </p>
			 <p>
				 This shouldn’t come as a surprise
				 <a href="https://en.wikipedia.org/wiki/Lateralization_of_brain_function">since we already know</a>
				 that different regions of the brain becomes more active depending on the activity.
				 Since structure, information and especially <strong>the culture</strong> of languages varies substantially
				 and the language a person speaks is a essential element of daily life.
			 </p>`
	};

	public get editorConfig() {
		return {
			extraPlugins: [
				getTrackChangesIntegrationClass( this.appData )
			],
			sidebar: {
				container: this.sidebar,
			},
			presenceList: {
				container: this.presenceList,
			},
			initialData: this.appData.initialData
		};
	}

	// Note that Angular refs can be used once the view is initialized so we need to create
	// these containers and use in the above editor configuration to workaround this problem.
	private sidebar = document.createElement( 'div' );
	private presenceList = document.createElement( 'div' );

	public ngAfterViewInit() {
		if ( !this.sidebarContainer || !this.presenceListContainer ) {
			throw new Error( 'Div containers for sidebar or sidebar were not found' );
		}

		this.sidebarContainer.nativeElement.appendChild( this.sidebar );
		this.presenceListContainer.nativeElement.appendChild( this.presenceList );
	}


	public onReady( editor: CKEditor5.Editor ) {
		this.ready.emit( editor );
	}
}

function getTrackChangesIntegrationClass( data: any ) {
	return class TrackChangesIntegration {
		private editor: CKEditor5.Editor;

		constructor( editor: CKEditor5.Editor ) {
			this.editor = editor;
		}

		init() {
			const usersPlugin = this.editor.plugins.get( 'Users' );
			const commentsPlugin = this.editor.plugins.get( 'Comments' );
			const trackChangesPlugin = this.editor.plugins.get( 'TrackChanges' );

			trackChangesPlugin.adapter = {
				getSuggestion: suggestionId => {
					console.log( 'Getting suggestion', suggestionId );

					// Write a request to your database here.
					// The returned `Promise` should be resolved with the suggestion
					// data object when the request has finished.
					switch ( suggestionId ) {
						case 'suggestion-1':
							return Promise.resolve( {
								id: suggestionId,
								type: 'insertion',
								authorId: 'user-2',
								createdAt: new Date()
							} );
						case 'suggestion-2':
							return Promise.resolve( {
								id: suggestionId,
								type: 'deletion',
								authorId: 'user-1',
								createdAt: new Date()
							} );
					}
				},

				addSuggestion: suggestionData => {
					console.log( 'Suggestion added', suggestionData );

					// Write a request to your database here.
					// The returned `Promise` should be resolved when the request
					// has finished. When the promise resolves with the suggestion data
					// object, it will update the editor suggestion using the provided data.
					return Promise.resolve( {
						createdAt: new Date()       // Should be set server-side.
					} );
				},

				updateSuggestion: suggestionData => {
					console.log( 'Suggestion updated', suggestionData );

					// Write a request to your database here.
					// The returned `Promise` should be resolved when the request
					// has finished.
					return Promise.resolve();
				}
			};

			commentsPlugin.adapter = {
				addComment( data ) {
					console.log( 'Comment added', data );

					// Write a request to your database here. The returned `Promise`
					// should be resolved when the request has finished.
					// When the promise resolves with the comment data object it
					// will update the editor comment using the provided data.
					return Promise.resolve( {
						createdAt: new Date() // Should be set server-side.
					} );
				},

				updateComment( data ) {
					console.log( 'Comment updated', data );

					// Write a request to your database here. The returned `Promise`
					// should be resolved when the request has finished.
					return Promise.resolve();
				},

				removeComment( commentId ) {
					console.log( 'Comment removed', commentId );

					// Write a request to your database here. The returned `Promise`
					// should be resolved when the request has finished.
					return Promise.resolve();
				},
				getCommentThread( threadId ) {
					console.log( 'Getting comment thread', threadId );

					// Write a request to your database here. The returned `Promise`
					// should resolve with the comment thread data.
					return Promise.resolve( {
						threadId: 'thread-1',
						comments: [ {
							commentId: 'comment-1',
							authorId: 'user-2',
							content: '<p>Are we sure we want to use a made-up disorder name?</p>',
							date: new Date()
						} ]
					} );
				}
			};

			for ( const user of data.users ) {
				usersPlugin.addUser( user );
			}

			// Set the current user.
			usersPlugin.defineMe( data.userId );

			// Load the suggestions data.
			for ( const suggestion of data.suggestions ) {
				trackChangesPlugin.addSuggestion( suggestion );
			}
		}
	}
}
