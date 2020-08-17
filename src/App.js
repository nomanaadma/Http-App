import React, { Component } from "react";
import "./App.css";
import axios from "axios";

axios.interceptors.response.use(null, error => {

    const expectedError = 
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500;
    
    if(!expectedError) {
        console.log("Logging the error", error);
        alert('An Unexpected error occured');
    }

    return Promise.reject(error);
});

const apiEndpoint = 'https://jsonplaceholder.typicode.com/posts';
class App extends Component {
    state = {
        posts: [],
    };

    handleAdd = async () => {
		const obj = { title: 'a', body: 'b' };
		const { data: post } = await axios.post(apiEndpoint, obj);
		const posts = [post, ...this.state.posts];
		this.setState({ posts });
    };

    async componentDidMount() {
		const { data: posts } = await axios.get(apiEndpoint);
		this.setState({ posts });
    }

    handleUpdate = async post => {
        post.title = 'UPDATED';
        await axios.put(apiEndpoint + '/' + post.id, post);
        
        const posts = [...this.state.posts];
        const index = posts.indexOf(post);
        posts[index] = {...post};
        this.setState({ posts });
    };

    handleDelete = async post => {

        const originalPosts = this.state.posts;
        const posts = this.state.posts.filter(p => p.id !== post.id);
        this.setState({ posts });

        try {
            await axios.delete(apiEndpoint + '/' + post.id);
        } catch(ex) {

            // ex.request == successfully send request to server
            // ex.response == succesfully get response from server
            // Expected (404: not found, 400, bad request) - CLIENT ERRORS
            // display a specific error message
            // Unexpected (network down, server down, db down, bug)
            // - log them
            // - Display a generic and friendly error message

            if(ex.response && ex.response.status === 404)
                alert('This post has already been deleted.');
            this.setState({ posts: originalPosts });

        }

    };

    render() {
        return (
            <React.Fragment>
                <button className="btn btn-primary" onClick={this.handleAdd}>
                    Add
                </button>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.posts.map(post => (
                            <tr key={post.id}>
                                <td>{post.title}</td>
                                <td>
                                    <button
                                        className="btn btn-info btn-sm"
                                        onClick={() => this.handleUpdate(post)}
                                    >
                                        Update
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => this.handleDelete(post)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}

export default App;
