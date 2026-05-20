# Use-Case Specification: Manage Comment | Version 1.1

## 1. Use-Case: Manage Comment
### 1.1 Brief Description
This use case describes the creation, reading, updating, and deleting of comments (CRUD) in the system. Comments can be replies to posts or replies to other comments, but they all follow the same CRUD operations.

---

## 2. Flow of Events

![Comment Management CRUD Diagram](../Visualizations/manage_comment_workflow_diagram.png)

### 2.1 Basic Flow
In general, a user will open a post, view all comments, write a comment, edit or delete a self written comment.

### 2.2 Creation
The creation of a new comment. The user must open a post to write a comment.

![Create Comment Diagram](../Visualizations/create_comment_activity_diagram.png)

This is what the post view looks like where users can create comments:
<br>
![picture](../screenshots/create_comment_UI.png)<br>

```gherkin
Feature: Create Comment
    As a logged in user
    I want to create a comment
    So that I can take part in a discussion
  
  Scenario: Create a comment
    Given I am on a post page
    When I click the "comment" button
    And I start typing in a text field
    And I click on 'submit' button
    Then the comment was successfully created
    And I am redirected to the post page
    And the text field is empty
    And I see my comment

  Scenario: Cancel Create a comment
    Given I am on a post page
    When I click the "comment" button
    And I start typing in a text field
    And I click on 'cancel' button
    Then I am redirected to the post page
    And the text field is empty
```

### 2.3 Edit
During editing, the user can modify the content of the comment.

![Edit Comment Diagram](../Visualizations/edit_comment_activity_diagram.png)

This is what the post view looks like where users can edit their comments:
<br>
![picture](../screenshots/edit_comment_UI.png)<br>

```gherkin
Feature: Edit Comment
    As a logged in user
    I want to edit a self written comment
    So that I can update a comment

  Scenario: Edit a comment
    Given I am on a post page
    And I see a self written comment
    When I click the "edit" button
    And I see the text from the comment in a text field
    And I start editing the input
    And I click on 'submit' button
    Then the comment was successfully edited
    And I am redirected to the post page
    And the text field is empty
    And I see my updated comment

  Scenario: Cancel Edit a comment
    Given I am on a post page
    And I see a self written comment
    When I click the "edit" button
    And I start typing in a text field
    And I click on 'cancel' button
    Then I am redirected to the post page
    And the text field is empty
    And I see the comment with no changes
```

### 2.4 List
The user wants to see the comments available on a post. Therefore, the system displays all comments under the post.

![List Comment Diagram](../Visualizations/list_comments_activity_diagram.png)

This is what the post view looks like where users can see comments:
<br>
![picture](../screenshots/list_comments_UI.png)<br>

```gherkin
Feature: List Comment
    As a logged in user
    I want to see all comments on a post
    So that I can read the discussion
  
  Scenario: List comment
    Given I am on a post page
    When I scroll down to the comments section
    Then all comments for this post will be displayed
    And I can see the comment content and author

```

### 2.5 Delete
The user can delete a self written comment. There is a button in the edit view to delete the comment. To ensure the user does not accidentally delete a comment, we added a modal asking for confirmation.

![Delete Comment Diagram](../Visualizations/delete_comment_activity_diagram.png)

This is what the delete confirmation looks like for comments:
<br>
![picture](../screenshots/delete_comment_UI.png)<br>

```gherkin
Feature: Delete Comment
    As a logged in user
    I want to delete a self written comment

  Scenario: Delete a comment
    Given I am on a post page
    And I see a self written comment
    When I click the "delete" button
    And a message shows "Do you really want to delete this comment?"
    And I click on 'yes' button
    Then the comment was successfully deleted
    And I am redirected to the post page
    And I get a confirmation message
    And the comment is gone

  Scenario: Cancel Delete a comment
    Given I am on a post page
    And I see a self written comment
    When I click the "delete" button
    And a message shows "Do you really want to delete this comment?"
    And I click on 'no' button
    Then the pop up window closes
    And I see the comment with no changes

```
---

## 3. Special Requirements

### 3.1 Owning an Account
In order to create, edit, or delete a comment, the user must have an account. Only if the user is authenticated, the dialog for commenting on posts will be visible.

---

## 4. Preconditions

### 4.1 The user has to be logged in
To ensure proper privacy and security, the user must be logged in when managing comments.

---

## 5. Postconditions

### 5.1 Create
After creating a new comment, the user will leave the edit view and see the post with all comments underneath.

### 5.2 Edit
After the user saves their edits, the updated comment will be displayed under the post.

### 5.3 List
When the user views a post, the system will fetch and display all comments for that post in the comments section.

### 5.4 Delete
After confirming the deletion in the pop up window that is shown, the comment will be permanently removed and no longer displayed under the post and in the list overview.
