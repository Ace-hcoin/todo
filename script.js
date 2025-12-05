// 所有任务都存在这个数组里
let todos = [];

// DOM 元素
const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");
const stats = document.getElementById("stats");
const clearCompletedBtn = document.getElementById("clear-completed");

// 启动时从 localStorage 读取数据
loadFromStorage();
render();

// 监听添加按钮
addBtn.addEventListener("click", () => {
    addTodo();
});

// 监听回车键（在输入框中）
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTodo();
    }
});

// 监听清除已完成
clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter((item) => !item.completed);
    saveToStorage();
    render();
});

// 添加任务
function addTodo() {
    const text = input.value.trim();
    if (text === "") {
        return; // 空内容不添加
    }

    const newTodo = {
        id: Date.now(), // 简单生成一个唯一 id
        text,
        completed: false,
    };

    todos.push(newTodo);
    input.value = "";
    saveToStorage();
    render();
}

// 切换完成状态
function toggleTodo(id) {
    todos = todos.map((item) => {
        if (item.id === id) {
            return {
                ...item,
                completed: !item.completed,
            };
        }
        return item;
    });
    saveToStorage();
    render();
}

// 删除任务（只负责改数组 + 重渲染）
function deleteTodo(id) {
    todos = todos.filter((item) => item.id !== id);
    saveToStorage();
    render();
}

// 渲染列表 + 动画
function render() {
    // 先清空
    list.innerHTML = "";

    todos.forEach((item) => {
        const li = document.createElement("li");
        li.className = "todo-item entering"; // 初始进入状态

        // 勾选框
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.completed;
        checkbox.addEventListener("change", () => {
            toggleTodo(item.id);
        });

        // 文本
        const span = document.createElement("span");
        span.className = "todo-text";
        span.textContent = item.text;
        if (item.completed) {
            span.classList.add("completed");
        }

        // 删除按钮
        const delBtn = document.createElement("button");
        delBtn.className = "delete-btn";
        delBtn.textContent = "删除";

        // 删除时先加 .removing 类触发动画，再真正删除
        delBtn.addEventListener("click", () => {
            li.classList.add("removing");
            // 等动画结束再从数组中删（这里和 CSS 的 0.2s 对应）
            setTimeout(() => {
                deleteTodo(item.id);
            }, 200);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);

        list.appendChild(li);

        // 下一帧移除 entering 类，触发从 entering → 正常状态的过渡动画
        requestAnimationFrame(() => {
            li.classList.remove("entering");
        });
    });

    updateStats();
}

// 更新底部统计信息
function updateStats() {
    const total = todos.length;
    const completed = todos.filter((item) => item.completed).length;
    stats.textContent = `${total} tasks · ${completed} completed`;
}

// 保存到 localStorage
function saveToStorage() {
    localStorage.setItem("todos_dahai", JSON.stringify(todos));
}

// 从 localStorage 读取
function loadFromStorage() {
    const saved = localStorage.getItem("todos_dahai");
    if (saved) {
        try {
            todos = JSON.parse(saved);
        } catch (e) {
            todos = [];
        }
    }
}
