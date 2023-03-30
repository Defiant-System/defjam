<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">


<xsl:template name="browser-tree">
	<xsl:for-each select="./*">
		<!-- <xsl:sort order="ascending" select="@i"/>
		<xsl:sort order="ascending" select="@name"/> -->
		<div class="leaf">
			<xsl:if test="@_id">
				<xsl:attribute name="data-id"><xsl:value-of select="@_id"/></xsl:attribute>
			</xsl:if>
			<i class="icon-folder">
				<xsl:if test="@i">
					<xsl:attribute name="class">icon-audio</xsl:attribute>
				</xsl:if>
			</i>
			<span><xsl:value-of select="@name"/></span>
		</div>
	</xsl:for-each>
</xsl:template>


<xsl:template name="track-lanes">
	<xsl:for-each select="./Tracks/Track">
		<div class="lane" style="--c: #77c;">
			<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:attribute name="style">
				<xsl:if test="@color">--c: <xsl:value-of select="@color"/></xsl:if>
			</xsl:attribute>
			<xsl:if test="@class">
				<xsl:attribute name="class">lane <xsl:value-of select="@class"/></xsl:attribute>
			</xsl:if>
			<xsl:for-each select="./Lane/Clip">
				<b>
					<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
					<xsl:attribute name="style">
						--cX: <xsl:value-of select="@cX"/>;
						--cW: <xsl:value-of select="@cW"/>;
					</xsl:attribute>
					<i><xsl:value-of select="@name"/></i>
				</b>
			</xsl:for-each>
		</div>
	</xsl:for-each>
</xsl:template>


<xsl:template name="track-mixers">
	<xsl:for-each select="./Tracks/Track">
		<div class="lane">
			<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:attribute name="style">
				<xsl:if test="@color">--c: <xsl:value-of select="@color"/></xsl:if>
			</xsl:attribute>
			<xsl:if test="@class">
				<xsl:attribute name="class">lane <xsl:value-of select="@class"/></xsl:attribute>
			</xsl:if>
			<div class="mix-head">
				<span class="lane-toggler" data-click="toggle-lane"></span>
				<div class="title" data-context="track-title-menu"><xsl:value-of select="@name"/></div>
			</div>
			<div class="mix-body"></div>
			<div class="mix-foot">
				<div class="track-btn activator" data-click="track-activator">
					<xsl:if test="./Buttons[@activator = 'off']"><xsl:attribute name="class">track-btn activator off</xsl:attribute></xsl:if>
					<xsl:if test="@io-label">
						<xsl:attribute name="data-label"><xsl:value-of select="@io-label"/></xsl:attribute>
					</xsl:if>
				</div>
				<div class="track-btn solo" data-click="track-solo">
					<xsl:if test="./Buttons[@solo = 'on']"><xsl:attribute name="class">track-btn solo active</xsl:attribute></xsl:if>
					S</div>
				<div class="track-btn record" data-click="track-record">
					<xsl:if test="./Buttons[@record = 'on']"><xsl:attribute name="class">track-btn record active</xsl:attribute></xsl:if>
					&#9679;
				</div>
				<div class="vol-analyser">
					<canvas width="5" height="5"></canvas>
				</div>
			</div>
		</div>
	</xsl:for-each>
</xsl:template>


<xsl:template name="io-track-lanes">
	<xsl:for-each select="./IoMaster/Track">
		<div class="lane collapsed">
			<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
		</div>
	</xsl:for-each>
</xsl:template>


<xsl:template name="io-track-mixers">
	<xsl:for-each select="./IoMaster/Track">
		<div class="lane collapsed">
			<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:attribute name="style">
				<xsl:if test="@color">--c: <xsl:value-of select="@color"/></xsl:if>
			</xsl:attribute>
			<xsl:if test="@class">
				<xsl:attribute name="class">lane <xsl:value-of select="@class"/></xsl:attribute>
			</xsl:if>
			<div class="mix-head">
				<span class="lane-toggler" data-click="toggle-lane"></span>
				<div class="title"><xsl:value-of select="@name"/></div>
			</div>
			<div class="mix-body"></div>
			<div class="mix-foot">
				<xsl:if test="@id != 'master'">
					<div class="track-btn activator" data-click="track-activator">
						<xsl:if test="./Buttons[@activator = 'off']"><xsl:attribute name="class">track-btn activator off</xsl:attribute></xsl:if>
						<xsl:if test="@io-label">
							<xsl:attribute name="data-label"><xsl:value-of select="@io-label"/></xsl:attribute>
						</xsl:if>
					</div>
					<div class="track-btn solo" data-click="track-solo">
						<xsl:if test="./Buttons[@solo = 'on']"><xsl:attribute name="class">track-btn solo active</xsl:attribute></xsl:if>
						S</div>
					<div class="track-btn record" data-click="track-record">
						<xsl:if test="./Buttons[@record = 'on']"><xsl:attribute name="class">track-btn record active</xsl:attribute></xsl:if>
						&#9679;</div>
				</xsl:if>
				<div class="vol-analyser">
					<canvas width="5" height="5"></canvas>
				</div>
			</div>
		</div>
	</xsl:for-each>
</xsl:template>


<xsl:template name="file-tracks">
	<xsl:for-each select="./Tracks/Track">
		<xsl:call-template name="session-track" />
	</xsl:for-each>
</xsl:template>


<xsl:template name="file-io">
	<xsl:for-each select="./IoMaster/Track">
		<xsl:call-template name="session-track" />
	</xsl:for-each>
</xsl:template>


<xsl:template name="session-track">
	<div class="track">
		<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:if test="@class">
			<xsl:attribute name="class">track <xsl:value-of select="@class"/></xsl:attribute>
		</xsl:if>
		<xsl:attribute name="style">
			<xsl:if test="@color">--c: <xsl:value-of select="@color"/>;</xsl:if>
		</xsl:attribute>
		<div class="title" data-context="track-title-menu"><xsl:value-of select="@name"/></div>
		<div class="slots">
			<xsl:for-each select="./Slot/Clip">
				<b>
					<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
					<xsl:attribute name="style">--r: <xsl:value-of select="@row"/>;</xsl:attribute>
					<xsl:value-of select="@name"/>
				</b>
			</xsl:for-each>
		</div>
		<div class="status">
			<xsl:if test="not(@io-label)">
				<i class="btn-stop" data-click="track-stop"></i>
			</xsl:if>
			<xsl:if test="not(@io-label) and @id != 'master'">
				<i class="pie-playing on1" style="--duration: 2s;"></i>
			</xsl:if>
		</div>
		<div class="io"></div>
		<div class="sends" data-name="Sends">
			<xsl:if test="count(./Sends) = 0"><xsl:attribute name="data-name"></xsl:attribute></xsl:if>
			<xsl:for-each select="./Sends">
				<div class="knob">
					<xsl:attribute name="data-label"><xsl:value-of select="@label"/></xsl:attribute>
					<xsl:attribute name="data-value"><xsl:value-of select="@value"/></xsl:attribute>
				</div>
			</xsl:for-each>
		</div>
		<div class="mixer">
			<div>
				<div class="pan-knob" data-value="0"><div></div></div>
				<xsl:if test="@id != 'master'">
					<div class="track-btn activator" data-click="track-activator">
						<xsl:if test="./Buttons[@activator = 'off']"><xsl:attribute name="class">track-btn activator off</xsl:attribute></xsl:if>
						<xsl:if test="@io-label">
							<xsl:attribute name="data-label"><xsl:value-of select="@io-label"/></xsl:attribute>
						</xsl:if>
					</div>
					<div class="track-btn solo" data-click="track-solo">S</div>
					<xsl:if test="not(@io-label)">
						<div class="track-btn record" data-click="track-record">
							<xsl:if test="./Buttons[@record = 'on']"><xsl:attribute name="class">track-btn record active</xsl:attribute></xsl:if>
							&#9679;
						</div>
					</xsl:if>
				</xsl:if>
			</div>
			<div class="volume">
				<xsl:attribute name="style">--vol: <xsl:value-of select="Volume/@value"/>%;</xsl:attribute>
				<div></div>
				<canvas width="6" height="111"></canvas>
			</div>
		</div>
	</div>
</xsl:template>


<xsl:template name="midi-notes">
	<xsl:for-each select="./b">
		<b>
			<xsl:attribute name="style">
				--y: <xsl:value-of select="@y"/>;
				--x: <xsl:value-of select="@b"/>;
				--w: <xsl:value-of select="@w"/>;
				<xsl:if test="@sX">transform: translateX(<xsl:value-of select="@sX"/>px);</xsl:if>
			</xsl:attribute>
			<!-- <xsl:value-of select="@n"/> -->
		</b>
	</xsl:for-each>
</xsl:template>


<xsl:template name="midi-note-volume">
	<xsl:for-each select="./b">
		<b>
			<xsl:attribute name="style">
				--x: <xsl:value-of select="@b"/>;
				--v: <xsl:value-of select="@v"/>;
				<xsl:if test="@sX">transform: translateX(<xsl:value-of select="@sX"/>px);</xsl:if>
			</xsl:attribute>
		</b>
	</xsl:for-each>
</xsl:template>


<xsl:template name="devices">
	<xsl:choose>
		<xsl:when test="@type = 'drumkit'">
			<xsl:call-template name="rack-drumkit" />
		</xsl:when>
		<xsl:when test="@type = 'synth'">
			<xsl:call-template name="rack-synth" />
		</xsl:when>
		<xsl:when test="@type = 'sampler'">
			<xsl:call-template name="rack-sampler" />
		</xsl:when>
	</xsl:choose>
</xsl:template>


<xsl:template name="rack-synth">
	<div class="rack-body">
		<div class="rack-head">
			<i class="icon-blank"></i> <xsl:value-of select="./Device/@name"/>
		</div>
		<div class="box-body">
			<div class="synth-controls">
				<xsl:call-template name="device-controls" />
			</div>
		</div>
	</div>
	<xsl:for-each select="./Device/Option">
		<xsl:choose>
			<xsl:when test="@name = 'Omni Oscillator'"><xsl:call-template name="rack-omniOscillator" /></xsl:when>
			<xsl:when test="@name = 'Envelope'"><xsl:call-template name="rack-envelope" /></xsl:when>
		</xsl:choose>
	</xsl:for-each>
</xsl:template>


<xsl:template name="rack-omniOscillator">
	<div class="rack-body" data-rack="omniOscillator">
		<div class="rack-head">
			<i class="icon-blank"></i> Omni Oscillator
		</div>
		<div class="box-body">
			<div class="display">
				<div class="graph has-values" data-mousedown="doPartialRect">
					<svg viewBox="0 0 210 108">
						<polyline class="st0" points=".5,7 .5,.5 7,.5 "/>
						<polyline class="st0" points="203,.5 209.5,.5 209.5,7 "/>
						<polyline class="st0" points="209.5,101 209.5,107.5 203,107.5 "/>
						<polyline class="st0" points=".5,101 .5,107.5 7,107.5 "/>
						<!-- result curve -->
						<polyline class="st1"/>
						<!-- partial rectangles goes here -->
						<!-- <g class="st3" transform="translate(2,46)">
							<rect x="0" y="0" width="102" height="60"/>
							<rect x="0" y="0" width="102" height="60"/>
						</g> -->
					</svg>
					<div class="value-row">
						<div data-click="show-shape-popup" data-arg="release">Type: <i class="icon-shape_triangle"></i></div>
						<div data-click="show-shape-popup" data-arg="attack">Modulation: <i class="icon-shape_sine"></i></div>
					</div>
				</div>
				<div class="controls">
					<div class="left">
						<div class="field">
							<label>Partials</label>
							<div class="option-group">
								<span>0</span>
								<span>1</span>
								<span class="active">2</span>
								<span>4</span>
								<span>8</span>
							</div>
						</div>
						<div class="field">
							<label>Harmonicity</label>
							<div class="range-input" data-value="35">
								<span>35%</span>
							</div>
						</div>
					</div>
					<div class="ctrl-knob2">
						<label>Phase</label>
						<div class="knob2" data-value="30"></div>
						<span>60 deg</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</xsl:template>


<xsl:template name="rack-envelope">
	<div class="rack-body" data-rack="envelope">
		<div class="rack-head">
			<i class="icon-blank"></i> Amplitude Envelope
		</div>
		<div class="box-body">
			<div class="display">
				<div class="graph has-values">
					<svg viewBox="0 0 310 108">
						<polyline class="st0" points=".5,7 .5,.5 7,.5 "/>
						<polyline class="st0" points="303,.5 309.5,.5 309.5,7 "/>
						<polyline class="st0" points="309.5,101 309.5,107.5 303,107.5 "/>
						<polyline class="st0" points=".5,101 .5,107.5 7,107.5 "/>

						<path class="st1" d="M4,104L60,4l32,40h96c30,15,79,40,117,60"/>
						<rect class="st2" x="58" y="3" width="4" height="4"/>
						<rect class="st2" x="142" y="42" width="4" height="4"/>
						<rect class="st2" x="303" y="101" width="4" height="4"/>
					</svg>
					<div class="value-row">
						<div data-click="show-curves-popup" data-arg="attack">Attack: <i class="icon-curve_linear"></i></div>
						<div data-click="show-curves-popup" data-arg="decay">Decay: <i class="icon-curve_decay_linear"></i></div>
						<div data-click="show-curves-popup" data-arg="release">Release: <i class="icon-curve_decay_linear"></i></div>
					</div>
				</div>
				<div class="controls">
					<div class="ctrl-knob2">
						<label>Attack</label>
						<div class="knob2" data-value="49"></div>
						<span>49.3 ms</span>
					</div>

					<div class="ctrl-knob2">
						<label>Decay</label>
						<div class="knob2" data-value="35"></div>
						<span>35.5 s</span>
					</div>

					<div class="ctrl-knob2">
						<label>Sustain</label>
						<div class="knob2" data-value="17"></div>
						<span>17 dB</span>
					</div>

					<div class="ctrl-knob2">
						<label>Release</label>
						<div class="knob2" data-value="18"></div>
						<span>18.3 ms</span>
					</div>

					<div class="ctrl-knob2">
						<label>Volume</label>
						<div class="knob2" data-value="67"></div>
						<span>-8.00 dB</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</xsl:template>


<xsl:template name="rack-sampler">
	<div class="rack-body">
		<div class="rack-head">
			<i class="icon-blank"></i> <xsl:value-of select="./Device/@name"/>
		</div>
		<div class="box-body">
			<div class="synth-controls">
				<xsl:call-template name="device-controls" />
			</div>
		</div>
	</div>
</xsl:template>


<xsl:template name="rack-drumkit">
	<div class="rack-body">
		<div class="rack-head">
			<i class="icon-blank"></i> <xsl:value-of select="./Device/@name"/>
		</div>
		<div class="box-body">
			<div class="drum-control">
				<xsl:call-template name="device-controls" />
			</div>

			<div class="pads">
				<div class="pad-matrix">
					<div class="selection"></div>
				</div>
				<div class="pads-wrapper">
					<ul class="pad-list disable-mute1">
					<xsl:for-each select="./Device/Pads/Pad">
						<xsl:call-template name="drum-pad" />
					</xsl:for-each>
					</ul>
				</div>
			</div>
		</div>
	</div>
</xsl:template>


<xsl:template name="device-controls">
	<ul class="col-4 controls">
		<xsl:for-each select="./Device/Settings/Knob">
		<li>
			<span class="ctrl-name"><xsl:value-of select="@name"/></span>
			<div class="knob ctrl-knob">
				<xsl:attribute name="data-value"><xsl:value-of select="@value"/></xsl:attribute>
			</div>
			<span class="ctrl-value"><xsl:value-of select="@value"/> <xsl:value-of select="@suffix"/></span>
		</li>
		</xsl:for-each>
	</ul>
</xsl:template>


<xsl:template name="drum-pad">
	<li>
		<xsl:attribute name="data-key"><xsl:value-of select="@key"/></xsl:attribute>
		<xsl:choose>
			<xsl:when test="@sample">
				<span class="pad-name"><xsl:value-of select="@name"/></span>
				<i class="pad-mute" data-click="mute-pad">M</i>
				<i class="pad-play" data-click="play-pad">
					<xsl:attribute name="data-arg"><xsl:value-of select="@n"/></xsl:attribute>
				</i>
				<i class="pad-solo" data-click="solo-pad">S</i>
			</xsl:when>
			<xsl:otherwise>
				<xsl:attribute name="class">empty</xsl:attribute>
			</xsl:otherwise>
		</xsl:choose>
	</li>
</xsl:template>


<xsl:template name="clip-pads">
	<xsl:choose>
		<xsl:when test="ancestor::Track[@type = 'drumkit']">
		<ol>
			<xsl:for-each select="ancestor::Track/Device/Pads/Pad">
				<xsl:sort order="ascending" select="@kI"/>
				<xsl:if test="@sample">
					<li>
						<xsl:attribute name="data-key"><xsl:value-of select="@key"/></xsl:attribute>
						<xsl:attribute name="data-sample"><xsl:value-of select="@sample"/></xsl:attribute>
						<xsl:value-of select="@name"/>
					</li>
				</xsl:if>
			</xsl:for-each>
		</ol>
		</xsl:when>
		<xsl:otherwise>
			<ul>
				<li data-label="C7"></li>
				<li data-label="C6"></li>
				<li data-label="C5"></li>
				<li data-label="C4"></li>
				<li data-label="C3"></li>
				<li data-label="C2"></li>
				<li data-label="C1"></li>
				<li data-label="C0"></li>
				<li data-label="C-1"></li>
				<li data-label="C-2"></li>
			</ul>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>


</xsl:stylesheet>
