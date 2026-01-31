const supabase = require('../config/supabase');

/**
 * Create Todo
 * Creates a new todo for the authenticated user
 */
const createTodo = async (req, res) => {
  try {
    const { title, completed = false } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Validate input
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a todo title.'
      });
    }

    // Create todo in database
    const { data: newTodo, error } = await supabase
      .from('todos')
      .insert([
        {
          title: title.trim(),
          completed,
          user_id: userId
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json({
      success: true,
      message: 'Todo created successfully.',
      data: newTodo
    });

  } catch (error) {
    console.error('Create todo error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating todo.',
      error: error.message
    });
  }
};

/**
 * Get All Todos
 * Retrieves all todos for the authenticated user
 */
const getTodos = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware

    // Fetch todos for the logged-in user
    const { data: todos, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Todos retrieved successfully.',
      count: todos.length,
      data: todos
    });

  } catch (error) {
    console.error('Get todos error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving todos.',
      error: error.message
    });
  }
};

/**
 * Update Todo
 * Updates a todo (only if it belongs to the authenticated user)
 */
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Validate input
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Todo ID is required.'
      });
    }

    // Check if todo exists and belongs to user
    const { data: existingTodo, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found.'
      });
    }

    // Verify ownership
    if (existingTodo.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this todo.'
      });
    }

    // Prepare update data
    const updateData = {};
    if (title !== undefined && title.trim() !== '') {
      updateData.title = title.trim();
    }
    if (completed !== undefined) {
      updateData.completed = completed;
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title or completed status to update.'
      });
    }

    // Update todo
    const { data: updatedTodo, error: updateError } = await supabase
      .from('todos')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({
      success: true,
      message: 'Todo updated successfully.',
      data: updatedTodo
    });

  } catch (error) {
    console.error('Update todo error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating todo.',
      error: error.message
    });
  }
};

/**
 * Delete Todo
 * Deletes a todo (only if it belongs to the authenticated user)
 */
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // From auth middleware

    // Validate input
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Todo ID is required.'
      });
    }

    // Check if todo exists and belongs to user
    const { data: existingTodo, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found.'
      });
    }

    // Verify ownership
    if (existingTodo.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this todo.'
      });
    }

    // Delete todo
    const { error: deleteError } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (deleteError) {
      throw deleteError;
    }

    return res.status(200).json({
      success: true,
      message: 'Todo deleted successfully.'
    });

  } catch (error) {
    console.error('Delete todo error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting todo.',
      error: error.message
    });
  }
};

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo
};
