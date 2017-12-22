exports.id = 'code';
exports.title = 'Code';
exports.group = 'Common';
exports.color = '#656D78';
exports.input = true;
exports.output = 1;
exports.author = 'Peter Širka';
exports.icon = 'code';
exports.version = '1.0.0';
exports.options = { outputs: 1, code: 'send(0, value)' };

exports.html = `<div class="padding">
	<div class="row">
		<div class="col-md-3">
			<div data-jc="textbox" data-jc-path="outputs" data-jc-config="type:number;validation:value > 0;increment:true;maxlength:3">@(Number of outputs)</div>
			<div class="help m">@(Minimum is 1)</div>
		</div>
	</div>
	<div data-jc="codemirror" data-jc-path="code" data-jc-config="type:javascript;required:true;height:500">@(Code)</div>
</div>
<script>
	var code_outputs_count;

	ON('open.function', function(component, options) {
		code_outputs_count = options.outputs = options.outputs || 1;
	});

	ON('save.function', function(component, options) {
		if (code_outputs_count !== options.outputs) {
			component.connections = {};
			component.output = options.outputs || 1;
			setState(MESSAGES.apply);
		}
	});
</script>`;

exports.readme = `# Code

This component executes custom JavaScript code as it is and it doesn't contain any secure scope.

\`\`\`javascript
// value {Object} contains received data
// send(outputIndex, newValue) sends a new value
// instance {Object} a current component instance
// flowdata {Object} a current flowdata
// Example:

// send() can be execute multiple times
send(0, value);
\`\`\``;

exports.install = function(instance) {

	var fn;

	instance.on('data', function(response) {
		fn && fn(response.data, instance.send2, instance, response);
	});

	instance.reconfigure = function() {
		try {
			if (instance.options.code) {
				instance.status('');
				fn = new Function('value', 'send', 'instance', 'flowdata', instance.options.code);
			} else {
				instance.status('Not configured', 'red');
				fn = null;
			}
		} catch (e) {
			fn = null;
			instance.error('Code: ' + e.message);
		}
	};

	instance.on('options', instance.reconfigure);
	instance.reconfigure();
};